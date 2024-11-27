# Configuring Tyk API Gateway

## Setup the Gateway

The Moesif Developer Portal can be used with a running instance of Tyk API Gateway. To integrate Moesif and Tyk, you can follow our guide that covers [integrating Moesif and Tyk in detail](https://www.moesif.com/docs/guides/integrating-api-analytics-with-tyk-api-gateway/). Alternatively, you can also check out [our integration documentation for Tyk](https://www.moesif.com/docs/server-integration/tyk-api-gateway/) if you’re already an experienced Tyk user. Once you have the integration set, you’ll be ready to move to the next step in the Moesif Developer Portal setup process.

## Configure the Gateway

### Creating an Endpoint in Tyk Dashboard

For the Moesif Developer Portal to help you monetize your APIs, you'll require an endpoint in Tyk. If you already have an endpoint created, feel free to skip ahead to the next step in the guide. If you need to create an endpoint and are using the Tyk Dashboard, you can create the endpoint by following these steps:

**Log in to Tyk Dashboard:**
If you already have an account, log in to the Tyk Dashboard. If not, sign up for an account to get started.

**Create a New API:**

- Navigate to the dashboard's main page.
- Click on the **APIs** section, located in the main navigation menu.
- Click the **Add New API** button to begin the API creation process.

**API Details:**

- Enter a suitable **API Name**, such as `TestService`.
- Under **Type**, select **HTTP**.
- Fill in the **Upstream URL** field with the URL of the service you want to expose. For this example, use `http://www.httpbin.org`.

Select **+ Configure API** to explore some more advanced configuration settings.

**API Configuration:**

- Under **Listen path**, set the listen path to whatever you would like, we will be setting it to **/test-service/**. Unselect **strip the listen path**
- Choose whether to enable SSL/TLS encryption for the API in the **Enable SSL/TLS** field.
- Specify supported protocols in the **API Protocol** field, such as `http, https`.
- Set allowed HTTP methods in the **Allowed HTTP Methods** field. Choose `GET` for this case.
- Under **Authentication**, we will want to set the **Authentication Mode** to **Authentication Token**. Under **Authentication Token > Auth Key Header Name**, type **Authorization**. If you would like to test your endpoint without any authentication you can set this to **Open (Keyless)**. This is assumed in the next testing step.

**Save Changes:**

- After completing the necessary fields and configuring API settings, save the changes by clicking the **Save** button.

### Testing the Endpoint

To test your newly created endpoint, you’ll want to use a tool like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/). Alternatively, you could also just use a browser. In your tool, add your endpoint URL, which will look like `{TYK_URL}:PORT/test-service/`, and send a `GET` request.

After the request has been sent, you should see a `200 OK` response as well as a response body containing the HttpBin contents.

## Configure Gateway Authentication

### Adding Authentication to Your Endpoint

Ensure that you have set the **Authentication Mode** to **Authentication Token** within your API configuration for your endpoint. Under **Authentication Token > Auth Key Header Name**, type **Authorization**.

## Configure the Developer Portal

### Configuring the .env File

In the Developer Portal code, there are a few environment variables that you will need to populate for Tyk. Below are the details on how to find and populate these variables in the `my-developer-portal-api/.env` file.

#### Tyk Gateway

For the `TYK_GATEWAY_URL`, If you’re running a local instance of Tyk, by default this should be running on `http://localhost:8080`. If this is the case, you can leave the value as is. If it is different or running remotely, you can change the value to point to your Tyk gateway.

#### Tyk Gateway Secret

This would also be a good time to grab your `TYK_GATEWAY_SECRET_KEY`. If running in docker, your `TYK_GATEWAY_SECRET_KEY` can be found in the `tyk.conf` file in the Gateway container under the `"secret"` variable.

### Connecting Tyk to Moesif

Now that we have our endpoints in Tyk set up and our base developer portal code pulled down, we can start to get analytics flowing into Moesif from Tyk. For instructions on how to integrate Tyk and Moesif, you can reference [our integration documentation](https://www.moesif.com/docs/server-integration/tyk-api-gateway/) or a more in-depth step-by-step approach in [our integration guide](https://www.moesif.com/docs/guides/integrating-api-analytics-with-tyk-api-gateway/).

### Tyk Master Key Creation

For the developer portal, an additional step is required within the Tyk configuration. In the `tyk.conf` file, we also need to set `allow_master_keys` to `true`. This allows us to automate authentication key creation via the Tyk API.

## Testing the Developer Portal

Once the Developer portal is configured, testing out all of the moving parts of the Developer Portal is crucial. Doing this ensures that everything is working as intended. See our detailed testing process [here](https://www.moesif.com/docs/developer-portal/using-the-portal/).
