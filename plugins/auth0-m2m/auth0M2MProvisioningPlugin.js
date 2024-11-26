const { ManagementClient, AuthenticationClient} = require("auth0");
const { ProvisioningPlugin } = require("../provisioningPlugin");

class Auth0M2MProvisioningPlugin extends ProvisioningPlugin {
    constructor() {
        super();
        this.slug = "auth0-jwt";
        this.mgmtClient = new ManagementClient({
            domain: process.env.AUTH0_DOMAIN,
            clientId: process.env.AUTH0_M2M_CLIENT_ID,
            clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET,
        });
        this.authClient = new AuthenticationClient({
            domain: process.env.AUTH0_DOMAIN,
            clientId: process.env.AUTH0_M2M_CLIENT_ID,
            clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET,
          });
        this.apiAudience = process.env.AUTH0_M2M_API_AUDIENCE;
        this.apiScope = process.env.AUTH0_M2M_API_SCOPE;

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
    
    async createApiKey(customerId, email) {
        const user = await this.getUser(customerId, email);

        if (!user['app_metadata'] || !user.app_metadata['customerId'] || !user.app_metadata['subscriptionId']) {
            throw new Error(`Auth0M2MProvisioningPlugin No subscription linked for this user. Must subscribe to a plan first`);
        }

        const scope = `${this.apiScopes || ""}`
        console.log(user)

        // FIXME needs to be scoped to single user
        const token = await this.authClient.oauth.clientCredentialsGrant({
            audience: this.apiAudience,
            scope: scope.trim(),
            organization_usage: 'require',  // This is important!
            allow_any_organization: false
        });
        return token.data.access_token
    }

    sanitizeEmail(email) {
        return email.replaceAll('@', '').replaceAll('+', '').replaceAll('.', '').replaceAll('-', '').toLowerCase()
    }  
}

module.exports = {
    Auth0M2MProvisioningPlugin,
};