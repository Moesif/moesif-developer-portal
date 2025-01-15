# Set up Custom Provisioning (JWT)

Moesif Developer Portal allows you to set up custom key provisioning for generating 
API keys to control secure access to your APIs. It has built-in support for JWT tokens. 

The following sections describe how to set up and use JWT as the custom key 
provisioning system. See [Build Your Own Key Provisioning Plugin](#build-your-own-key-provisioning-plugin) 
for instructions on how to set up your own key provisioning system.

## Configure the Developer Portal

### Configuring the .env File

In the `my-dev-portal-api` project, you'll need to set the following envvars in your `.env` file:

|envvar name|description|
|-----------|-----------|
|PLUGIN_JWT_ALGORITHM|Algorithm to use for signing JWT. The developer portal supports `RS256` and `HS256` algorithms.|
|PLUGIN_JWT_SECRET|Secret used for signing. Make sure to keep private and store in a robust key store.|
|PLUGIN_JWT_USER_ID_FIELD|The field in the claims that contains user id. Defaults to "sub"|
|PLUGIN_JWT_COMPANY_ID_FIELD|The field in the claims that contains company (customer) id. Defaults to "org_id"|
|PLUGIN_JWT_EXPIRES_IN|How long JWT is valid. Can be a number in seconds or use shorthand like "30d"|
|PLUGIN_JWT_KID|The key ID value of a JWT that uniquely identifies the JWT in a JWKS (JSON Web Key Set).|

### Configuring API gateway or app

Within your API gateway or service, install a [Moesif server integration](https://www.moesif.com/docs/server-integration/).
Configure the server integration's identify company function to extract the `org_id` claim from the JWT.

#### AWS API Gateway Specific Configuration

In order to set up JWT key provisioning with AWS API Gateway, you can either create a `JWT authorizer` or a custom `Lambda Authorizer`.
Follow the [instructions here](https://docs.aws.amazon.com/apigateway/latest/developerguide/configure-api-gateway-lambda-authorization.html) to create a new Lambda Authorizer. Once done:
1. If not done already, cd into `my-dev-portal-api` and run `npm install`
2. Go to your newly created Lambda Authorizer in the AWS Console
3. Under Code source, click the Upload from dropdown and select .zip file.
4. Upload the zip `resources/aws-authorizer/authorizer.zip` to your newly created authorizer.

## Build Your Own Key Provisioning Plugin
If you want to implement your own provisioning system to generate API keys, implement the 
[`ProvisioningPlugin` class](https://github.com/Moesif/moesif-developer-portal/blob/main/plugins/provisioningPlugin.js):

```javascript
/**
 * Interface for ProvisioningPlugin
 * @interface ProvisioningPlugin
 */
class ProvisioningPlugin {
  
    /**
     * Unique slug to identify plugin such as "kong-konnect" or "auth0-jwt"
     * @type {string}
     */
    slug;
  
    /**
     * Get a user from the gateway or auth provider
     * @param {string} customerId - The ID of the customer.
     * @param {string} email - The email of the user.
     * @returns {string} - The normalized user object.
     */
    getUser(customerId, email) {
      throw new Error('Method not implemented.');
    }
    
    /**
     * Create a new user
     * @param {string} customerId - The ID of the customer.
     * @param {string} email - The email of the user.
     * @param {string} subscriptionId - The billing subscription ID.
     * @returns {string} - The normalized user object.
     */
    provisionUser(customerId, email, subscriptionId)  {
      throw new Error('Method not implemented.');
    }
    
    /**
     * Create a new API Key
     * @param {string} customerId - The ID of the customer.
     * @param {string} email - The email of the user.
     * @param {string} userId - The ID of the user.
     * @returns {string} - The API key.
     */
    createApiKey(customerId, email) {
      throw new Error('Method not implemented.');
    }

      /**
     * Read config from envvars. Backwards Compatible with old envvar names
     * @param {string} name - Name of the envvar
     * @returns {string} - The envvar value.
     */
    getConfig(name) {
      return process.env[name] || process.env[name.replace('PLUGIN_', '')]
    }
  }
  
  module.exports = {
    ProvisioningPlugin,
  };
```

Then make sure you load the plugin in developer 
portal API's 
[`pluginLoader.js`](https://github.com/Moesif/moesif-developer-portal/blob/main/my-dev-portal-api/config/pluginLoader.js) file.

For an example implementation of the `ProvisioningPlugin` class, see 
[its implementation for the JWT plugin](https://github.com/Moesif/moesif-developer-portal/blob/main/plugins/jwt/jwtProvisioningPlugin.js).

