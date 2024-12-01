const { ProvisioningPlugin } = require("../provisioningPlugin");

class KonnectProvisioningPlugin extends ProvisioningPlugin {
    constructor() {
        super();
        this.slug = "kong-konnect";
        this.konnectBaseUrl = `${this.getConfig('PLUGIN_KONNECT_API_URL')}/${this.getConfig('PLUGIN_KONNECT_API_VERSION')}`;
        this.konnectPat = this.getConfig('PLUGIN_KONNECT_PAT')
        this.runtimeGroupName = this.getConfig('PLUGIN_KONNECT_RUNTIME_GROUP_NAME')
    }

    async kongAdminRequest(method, resource, body) {
      const url = `${this.konnectBaseUrl}/${resource}`
      console.log(`KongProvisioningPlugin ${method} ${url}`)
      const response = await fetch(url,
        {
          method: method,
          headers: {
            Authorization: `Bearer ${this.konnectPat}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: body ? JSON.stringify(body) : undefined
        }
      );
    
      if (!response.ok) {
        console.log(
          `KonnectProvisioningPlugin Failed ${method} ${url}: ${response.status}, ${response.statusText}`
        );
        throw new Error(`KonnectProvisioningPlugin Failed ${method} ${url}: ${response.status}, ${response.statusText}`);
      }
    
      return await response.json();
    }

    async getUser(customerId, email) {
        try {
          // get Konnect Runtime Group ID
          const rtgResult = await this.kongAdminRequest('GET', `runtime-groups?filter[name][eq]=${this.runtimeGroupName}`, undefined);
        
          console.log(`Got Konnect runtime group ID: ${rtgResult.data[0].id}`);
          const konnectRtgId = rtgResult.data[0].id;
  
          const resource = `runtime-groups/${konnectRtgId}/core-entities/consumers/${encodeURIComponent(
            email
          )}`
          return await this.kongAdminRequest('GET', resource, undefined);
        } catch (error) {
            console.error(error);
            throw new Error('KonnectProvisioningPlugin Failed to get user');
        }
    }

    async provisionUser(customerId, email, subscriptionId) {
      console.log("Kong Konnect, collecting runtime group ID");

      // get Konnect Runtime Group ID
      const rtgResult = await this.kongAdminRequest('GET', `runtime-groups?filter[name][eq]=${this.runtimeGroupName}`, undefined);
    
      console.log(`KonnectProvisioningPlugin runtime group ID: ${rtgResult.data[0].id}`);
      const konnectRtgId = rtgResult.data[0].id;
    
      // create Konnect Consumer
      const kongConsumer = {
        username: email,
        custom_id: customerId,
      };
    
      console.log("KonnectProvisioningPlugin, ensuring a consumer exists");
      const consumerResponse = await this.kongAdminRequest('POST', `runtime-groups/${konnectRtgId}/core-entities/consumers/`, kongConsumer);
      return consumerResponse;
    }
      
    async createApiKey(customerId, email) {
      // get Konnect Runtime Group ID
      console.log("KonnectProvisioningPlugin, collecting runtime group ID");
      const rtgResult = await this.kongAdminRequest('GET', `runtime-groups?filter[name][eq]=${this.runtimeGroupName}`, undefined);
    
      console.log(`KonnectProvisioningPlugin Got runtime group ID: ${rtgResult.data[0].id}`);
      const konnectRtgId = rtgResult.data[0].id;
    
      //get kong consumer
      const consumerResource = `runtime-groups/${konnectRtgId}/core-entities/consumers/${encodeURIComponent(
        email
      )}`
      const consumerResult = await this.kongAdminRequest('GET', consumerResource, undefined);
    
      // create Konnect Consumer Key-Auth
      const keyAuthResource = `runtime-groups/${konnectRtgId}/core-entities/consumers/${consumerResult.id}/key-auth`
      const konnectKeyResult = await this.kongAdminRequest('POST', keyAuthResource, undefined);
      return konnectKeyResult.key;
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
  KonnectProvisioningPlugin,
};