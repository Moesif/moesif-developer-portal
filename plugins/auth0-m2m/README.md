# Configuring Auth0 Machine2Machine

The Moesif Developer Portal can be used with Auth0 Machine2Machine flow to generate OAuth credentials (i.e. a client id/secret) and display to customer to access your APIs. The customer can use this with OAuth client to convert into a short-lived JWT enabling access with any API gateway or framework which supports JWT including AWS API Gateway with a Lambda Authorizer. 

> When 

> Auth0 Machine2Machine flows requires a paid plan from Auth0. Alternatively, you can use the JWT provisioning plugin to achieve similar functionality.

## Configure the Developer Portal

### Configuring the .env File

You'll first need to create a client in Auth0 with the correct permissions. 
1. Log into Auth0 and navigate to "Applications"
2. Click Create Application and select "Machine2Machine"
3. Select the "Auth0 Management API" and select the following scopes:

* create:client_grants
* read:users
* create:users
* update:users
* create:clients
* create:organizations
* read:organizations
* update:organizations
* create:organization_members
* create:organization_client_grants

In the `my-dev-portal-api` project, you'll need to set the following envvars in your `.env` file:

|envvar name|description|
|-----------|-----------|
|PLUGIN_AUTH0_M2M_DOMAIN|Auth0 Domain for your account. Typically ends in auth0.com|
|PLUGIN_AUTH0_M2M_CLIENT_ID|Client Id for the Auth0 Application which can access the Auth0 Management API|
|PLUGIN_AUTH0_M2M_CLIENT_SECRET|Secret for the Auth0 Application which can access the Auth0 Management API|
|PLUGIN_AUTH0_M2M_API_AUDIENCE|Your own API's audience (not Auth0 Management API)|
|PLUGIN_AUTH0_M2M_API_SCOPE|Your own API's scopes (not Auth0 Management API)|

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