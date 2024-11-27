# Configuring JWT

## Setup the Gateway

The Moesif Developer Portal can be used with Json Web Tokens (JWT) to generate keys and display to customer. Any API gateway or framework that supports JWT can be used with this plugin. In order to identify the company or customer, a claim is added to the JWT. 

> A JWT is a bearer token and requires extra caution. You should either issue short-lived tokens or have a separate mechanism to revoke JWT in case leaked. Moesif [governance rules can be used to block tokens](https://www.moesif.com/features/api-governance-rules) automatically if you don't have this functionality.

## Configure the Developer Portal

### Configuring the .env File

In the `my-dev-portal-api` project, you'll need to set the following envvars in your `.env` file:

|envvar name|description|
|-----------|-----------|
|JWT_ALGORITHM|Algorithm to use for signing JWT|
|JWT_SECRET|Secret used for signing. Make sure to keep private and store in a robust key store.|
|JWT_USER_ID_FIELD|The field in the claims that contains user id. Defaults to "sub"|
|JWT_COMPANY_ID_FIELD|The field in the claims that contains company (customer) id. Defaults to "company_id"|
|JWT_EXPIRES_IN|How long JWT is valid. Can be a number in seconds or use shorthand like "30d"|