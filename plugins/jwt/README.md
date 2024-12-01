# Configuring JWT

The Moesif Developer Portal can be used with Json Web Tokens (JWT) to generate keys and display to customer to access your APIs. Any API gateway or framework that supports JWT can be used with this plugin including AWS API Gateway with a Lambda Authorizer along with most web frameworks. In order to identify the company or customer, a claim is added to the JWT. By default, this is `org_id` but can be changed.

> A JWT is a bearer token and requires extra caution. You should either issue short-lived tokens or have a separate mechanism to revoke JWT in case leaked. Moesif [governance rules can be used to block tokens](https://www.moesif.com/features/api-governance-rules) automatically if you don't have this functionality.

## Configure the Developer Portal

### Configuring the .env File

In the `my-dev-portal-api` project, you'll need to set the following envvars in your `.env` file:

|envvar name|description|
|-----------|-----------|
|JWT_ALGORITHM|Algorithm to use for signing JWT|
|JWT_SECRET|Secret used for signing. Make sure to keep private and store in a robust key store.|
|JWT_USER_ID_FIELD|The field in the claims that contains user id. Defaults to "sub"|
|JWT_COMPANY_ID_FIELD|The field in the claims that contains company (customer) id. Defaults to "org_id"|
|JWT_EXPIRES_IN|How long JWT is valid. Can be a number in seconds or use shorthand like "30d"|

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