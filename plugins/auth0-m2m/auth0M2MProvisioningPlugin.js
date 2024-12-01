const { ManagementClient, AuthenticationClient} = require("auth0");
const { ProvisioningPlugin } = require("../provisioningPlugin");

class Auth0M2MProvisioningPlugin extends ProvisioningPlugin {
    constructor() {
        super();
        this.slug = "auth0-jwt";
        this.mgmtClient = new ManagementClient({
            domain: this.getConfig('PLUGIN_AUTH0_M2M_DOMAIN'),
            clientId: this.getConfig('PLUGIN_AUTH0_M2M_CLIENT_ID'),
            clientSecret: this.getConfig('PLUGIN_AUTH0_M2M_CLIENT_SECRET'),
        });
        this.authClient = new AuthenticationClient({
            domain: this.getConfig('PLUGIN_AUTH0_M2M_DOMAIN'),
            clientId: this.getConfig('PLUGIN_AUTH0_M2M_CLIENT_ID'),
            clientSecret: this.getConfig('PLUGIN_AUTH0_M2M_CLIENT_SECRET'),
          });

        this.apiAudience = this.getConfig('PLUGIN_AUTH0_M2M_API_AUDIENCE');
        this.apiScope = this.getConfig('PLUGIN_AUTH0_M2M_API_SCOPE');

        this.claimKeyCustomerId = `${this.apiAudience}/customerId`;
        this.claimKeySubscriptionId = `${this.apiAudience}/subscriptionId`;
    }

    async getUser(customerId, email) {
        const result = await this.mgmtClient.usersByEmail.getByEmail({email});
        return result.data[0];
    }
    
    async provisionUser(customerId, email, subscriptionId) {
        
        // Find the user in Auth0 by their email. 
        const user = await this.getUser(customerId, email);

        // Create a new org for this subscription
        const org = await this.mgmtClient.organizations.create(
            {
                name: this.sanitizeEmail(email),
            },
            {
                app_metadata: {
                    customerId: customerId,
                    subscriptionId: subscriptionId,
                },
            }
        );

        // Add user to this org
        const memberRes = await this.mgmtClient.organizations.addMembers(
            {
              id: org.data.id,
            },
            { members: [user.user_id] }
          );


        // Update the user's app_metadata with the stripe customer ID
        await this.mgmtClient.users.update(
            {
                id: user.user_id,
            },
            {
                app_metadata: {
                    customerId: customerId,
                    subscriptionId: subscriptionId,
                },
            }
        );
    }
    
    // Auth0 Machine-to-Machine (M2M) Access for Organizations. Requires paid plan from Auth0
    // https://auth0.com/docs/manage-users/organizations/organizations-for-m2m-applications
    // You can replace this function with your own logic to create API keys scoped to a single organization
    async createApiKey(customerId, email) {
        const user = await this.getUser(customerId, email);
        const userOrgs = await this.mgmtClient.users.getUserOrganizations({
            id: user.user_id,
          });

        if (!userOrgs['data'] || userOrgs.data.length != 1) {
            // Currently only support users linked to a single org
            throw new Error(`Auth0M2MProvisioningPlugin Cannot determine org_id for user ${user.user_id}`);
        }
        const orgId = userOrgs.data[0].id;

        // Create an Application (Client) for this specific tenant
        // Auth0 requires complying with OIDC compliant OAuth flow in order to share a long lived key
        // To scope secret to a single org, we create a dedicated application
        const client = await this.mgmtClient.clients.create({
            name: this.sanitizeEmail(email),
            app_type: 'non_interactive',
            is_first_party: true,
            default_organization: {
                organization_id: orgId,
                flows: ['client_credentials']
            },
            organization_usage: 'require',  // This is important!
        });

        const clientId = client.data.client_id
        const response = JSON.stringify({client_id: clientId, client_secret: client.data.client_secret})

        // Define grant behavior for the recently created client
        const grant = await this.mgmtClient.clientGrants.create({
            client_id: clientId,
            audience: this.apiAudience,
            scope: this.apiScope.trim().split(' '),
            organization_usage: 'require',  // This is important!
            allow_any_organization: false
        });
        const grantId = grant.data.id;

        // Authorize the organization to access this application and API
        const memberRes = await this.mgmtClient.organizations.postOrganizationClientGrants(
            {
                id: orgId,
            },
            {
                grant_id: grantId,
            });
        console.log('memberRes')
        console.log(JSON.stringify(memberRes))
        return response
    }

    sanitizeEmail(email) {
        return email.replaceAll('@', '').replaceAll('+', '').replaceAll('.', '').replaceAll('-', '').toLowerCase()
    }  
}

module.exports = {
    Auth0M2MProvisioningPlugin,
};