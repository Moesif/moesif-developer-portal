const { ProvisioningPlugin } = require("../provisioningPlugin");

class TykProvisioningPlugin extends ProvisioningPlugin {
    constructor() {
        super();
        this.slug = "tyk";
        this.tykDashOrgId = this.getConfig('PLUGIN_TYK_DASH_ORG_ID');
        this.tykGatewayUrl = this.getConfig('PLUGIN_TYK_GATEWAY_URL');
        this.tykGatewaySecretKey = this.getConfig('PLUGIN_TYK_GATEWAY_SECRET_KEY');
    }

    async tykAdminRequest(method, resource, body) {
      const url = `${this.tykGatewayUrl}/${resource}`
      const response = await fetch(url,
        {
          method: method,
          headers: {
            "x-tyk-authorization": this.tykGatewaySecretKey,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: body ? JSON.stringify(body) : undefined
        }
      );
    
      if (!response.ok) {
        console.log(
          `TykProvisioningPlugin Failed ${method} ${resource}: ${response.status}, ${response.statusText}`
        );
        throw new Error(`TykProvisioningPlugin Failed ${method} ${resource}: ${response.status}, ${response.statusText}`);
      }
    
      return await response.json();
    }

    async getUser(customerId, email) {
        try {
          const resource = `consumers/${encodeURIComponent(
            email
          )}`
          return await this.tykAdminRequest('GET', resource, undefined);
        } catch (error) {
            console.error(error);
            throw new Error('TykProvisioningPlugin Failed to get user');
        }
    }

    async provisionUser(customerId, email, subscriptionId) {    
      // create Consumer
      const user = {
        username: email,
        custom_id: customerId,
      };
    
      console.log("TykProvisioningPlugin ensuring a consumer exists");
      const consumerResponse = await this.tykAdminRequest('POST', `consumers/`, user);
      return consumerResponse;
    }

    async createApiKey(customerId, email) {    

      // Create the request body for Tyk API
      var tykUser = {
        alias: customerId,
        org_id: this.tykDashOrgId,
      };
  
      const result = await this.tykAdminRequest('POST', 'tyk/keys', tykUser);
      return result.key;
    }

    normalizeUser(user) {
        // Normalize the user object as needed
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            billing_customer_id: user.custom_id,
            billing_subscription_id: user.billing_subscription_id
        };
    }
}

module.exports = {
  TykProvisioningPlugin,
};