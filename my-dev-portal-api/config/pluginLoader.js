function getApimProvisioningPlugin() {
    // Read both envvars for backwards compatibility
    const apimProvider = process.env.PLUGIN_APIM_PROVIDER || process.env.APIM_PROVIDER;
    if (!apimProvider) {
      console.error(
        "No PLUGIN_APIM_PROVIDER found. Please create an .env file with PLUGIN_APIM_PROVIDER one of the supported API management providers or edit the code to connect to your API Management."
      );
    }
    switch (apimProvider.toLowerCase()) {
        case 'auth0-m2m':
          const { Auth0M2MProvisioningPlugin } = require('dev-portal-auth0-m2m-plugin');
          return new Auth0M2MProvisioningPlugin();
        case 'jwt':
        case 'aws':
          const { JwtProvisioningPlugin } = require('dev-portal-jwt-plugin');
          return new JwtProvisioningPlugin();
        case 'kong':
          if ((typeof process.env.KONNECT_PAT !== "undefined" &&
              process.env.KONNECT_PAT !== "") || (
                typeof process.env.PLUGIN_KONNECT_PAT !== 'undefined' ||
                process.env.PLUGIN_KONNECT_PAT !== ""
              )
          ) {
            const { KonnectProvisioningPlugin } = require('dev-portal-kong-konnect-plugin');
            return new KonnectProvisioningPlugin()
          } else {
            const { KongProvisioningPlugin } = require('dev-portal-kong-gateway-plugin');
            return new KongProvisioningPlugin()
          }
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
