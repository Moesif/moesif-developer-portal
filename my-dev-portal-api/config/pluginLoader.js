function getApimProvisioningPlugin() {
    const apimProvider = process.env.APIM_PROVIDER;
    if (!apimProvider) {
      console.error(
        "No APIM_PROVIDER found. Please create an .env file with APIM_PROVIDER one of the supported API management providers or edit the code to connect to your API Management."
      );
    }
    switch (apimProvider.toLowerCase()) {
        case 'kong':
          if (typeof process.env.KONNECT_PAT !== "undefined" &&
              process.env.KONNECT_PAT !== ""
          ) { 
            const { KonnectProvisioningPlugin } = require('dev-portal-kong-konnect-plugin');
            return new KonnectProvisioningPlugin()
          } else {
            const { KongProvisioningPlugin } = require('dev-portal-kong-gateway-plugin');
            return new KongProvisioningPlugin()
          }
        case 'auth0-m2m': 
        case 'aws': 
          const { Auth0M2MProvisioningPlugin } = require('dev-portal-auth0-m2m-plugin');
          return new Auth0M2MProvisioningPlugin();
        case 'tyk':
          const { TykProvisioningPlugin } = require('dev-portal-tyk-plugin');
          return new TykProvisioningPlugin();
        default:
            console.log(`Invalid apimProvider ${apimProvider} defined.`);
    }
}

module.exports = {
  getApimProvisioningPlugin,
};
  