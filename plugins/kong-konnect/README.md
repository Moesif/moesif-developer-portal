# Configuring Kong Konnect

## Setup the Gateway

The Moesif Developer Portal can be used with a running instance of Kong. To integrate Moesif and Kong, you can follow our guide that covers [integrating Moesif and Kong in detail](https://www.moesif.com/docs/guides/guide-kong-gateway-integration/). Alternatively, you can also check out [our integration documentation for Kong](https://www.moesif.com/docs/server-integration/kong-api-gateway/) if you’re already an experienced Kong user. Once you have the integration set, you’ll be able to complete the rest of the Kong setup for the Developer Portal.

## Configure the Gateway

### Creating an Endpoint in Kong Manager

In order to use the developer portal to monetize your APIs, you'll require an endpoint in Kong. If you already have an endpoint created, you can use this existing endpoint.

If you are using Kong Manager, you can create the endpoint by clicking **Services** in the left-side menu, under the **API Gateway** section. On the **Services** page, click the **New Service** button in the top-right corner to add a new service.

On the **Create Service** page, You will need to fill out the **Name** and, after selecting the **Add using URL** option, the **URL** field. For this example, you can fill them out with the following values:

| Field     | Value                     |
|-----------|---------------------------|
| Name      | `HttpBin`                 |
| URL       | `https://www.httpbin.org` |

Once populated, click **Create** to create the service. After this, you’ll see your new services viewing page.

Next, we will create a route that will expose this service. To do this, click on **Routes** in the left-side menu, which is also under the **API Gateway** section.

On the **Routes** page, click on the **Create Route** button in the top-right corner of the screen to add the new route. On the **Create Route** screen, you’ll have a few values to fill out including the **Service, Name**, **Protocols**, **Method(s)**, and **Path(s)** fields on the screen. For this example, you can fill out these fields with the following values:

| Field      | Value                            |
|------------|----------------------------------|
| Service    | The service you just created, `HttpBin` |
| Name       | `TestService`                    |
| Protocols  | `http, https`                    |
| Method(s)  | `GET`                            |
| Path(s)    | `/test-service`                  |

Once populated, click **Create** to create the route. After this, you’ll see your new routes viewing page. With the endpoint creation complete, we can now move on to testing it to ensure it is configured correctly.

### Testing the Endpoint

To test your newly created endpoint, you’ll want to use a tool like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/). Alternatively, you could also just use a browser at this point too. In your tool, add your endpoint URL which will look like `{PLUGIN_KONG_URL}:PORT/test-service/` and send a GET request. If you are running Kong in Docker and have set up the endpoint as shown above, your URL will look like `localhost:8000/test-service/`.

After the request has been sent, you should see a `200 OK` response as well as a response body containing the HttpBin contents (essentially a webpage). With our endpoint working, now let’s move on to securing it with an API key.

## Configure Gateway Authentication

### Adding Key Auth to All Endpoints

Since the Developer Portal generates API keys, is you must add and enable the **Key-Auth** plugin to our Kong endpoint. For simplicity, you can enable this plugin globally. If only you want to only apply **Key-Auth** to specific/monetized routes, you can do that as well.

In the Kong Manager Dashboard, you can add the plugin by clicking **Plugins** in the left-side menu, under the **API Gateway** section. On the **Plugins** page, you’ll click the **New Plugin** button to add a new plugin. On the **Add New Plugin** screen, you’ll find the **Key-Authentication** plugin by scrolling or searching, once found, click **Enable**.

On the **Create new key-auth plugin** screen, you’ll want to make sure that the **This plugin is Enabled** toggle is set to `on`, the **Global** radio button is selected, and that **Config.Key Names** field is set to `apikey`. By setting this to `apikey` we can pass a field of the same name in the header and include our API key as the value.

Lastly, to save our plugin configuration, scroll down to the bottom of the screen and click **Create**. Now, our endpoint will be secured by the kay-auth plugin. To test it out, resend the request from earlier and you should get a `401 Unauthorized` response, and a message body stating `No API key found in request`. If you are not getting this response, please refer to the [Kong documentation for key-auth](https://docs.konghq.com/hub/kong-inc/key-auth/).

## Configure the Developer Portal

### Configuring the .env File

In the `my-dev-portal-api` project, for the `PLUGIN_KONG_URL`, you'll need to add in the URL of your Kong instance. Specifically the Kong admin API URL/port, not the gateway URL/port where traffic is proxied. If you’re running a local instance of Kong, by default this will be running on `http://localhost:8001`. If this is the case, you can leave the value as is. If it is different or running remotely, you can change the value to point to the correct URL/port.

### Kong Konnect

For Kong Konnect, the setup also requires you to add a few additional environment variables to the `my-dev-portal-api/.env` file. You'll want to add in the following key-values to the file:

``` conf
PLUGIN_KONNECT_API_URL="https://us.api.konghq.com"
PLUGIN_KONNECT_API_VERSION="v2"
PLUGIN_KONNECT_RUNTIME_GROUP_NAME="default"
PLUGIN_KONNECT_PAT=""
```

for the `PLUGIN_KONNECT_API_URL` and `PLUGIN_KONNECT_API_VERSION` values, you'll want to log into your Kong Konnect control plane and retrieve this. You can get this value by going to the **Gateway Manager** screen and selecting your control plane. In the next screen, you can grab the **Admin API** value (located in near the top of the screen) and truncate anything we don't need.

The raw value will look like this: `https://us.api.konghq.com/v2/control-planes/123-asd-etc`

From this, we can populate our values like so:

``` conf
PLUGIN_KONNECT_API_URL="https://us.api.konghq.com"
PLUGIN_KONNECT_API_VERSION="v2"
```

For the `PLUGIN_KONNECT_RUNTIME_GROUP_NAME`, you'll use your **Control Plane** name. By default, this will be fittingly named `default`.

``` conf
PLUGIN_KONNECT_RUNTIME_GROUP_NAME="default"
```

Lastly, we will generate a Konnect Personal Access Token. This can be done through the Konnect UI by going to your initials in the top-right of the screen and from the dropdown, selecting **Personal Access Tokens**.

From here, click **Generate Token**, give the token a **Name** and **Expiration**, then click **Generate**. Paste the returned value into the `PLUGIN_KONNECT_PAT` value.

```conf
PLUGIN_KONNECT_PAT="kpat_FIZqQxICG6aEpA10nQ1TesTtEStTEST"
```

### Connecting Kong to Moesif

The Moesif-Kong plugin makes it easy to get API call analytics funneled into Moesif. For instructions on how to do this, you can reference [our integration documentation](https://docs.konghq.com/hub/moesif/kong-plugin-moesif/) or a more in-depth step-by-step approach in [our integration guide](https://www.moesif.com/docs/guides/guide-kong-gateway-integration/).

Once the Moesif-Kong integration and **key-auth** is been enabled, you should begin to see some API call metrics flowing into Moesif. You may also want to ensure that API calls are being blocked by the **key-auth** plugin in Kong for unauthenticated calls. When unauthorized calls are sent to Kong, the `401 Unauthorized` responses should also show up in Moesif.

## Testing the Developer Portal

Once the Developer portal is configured, testing out all of the moving parts of the Developer Portal is crucial. Doing this ensures that everything is working as intended. See our detailed testing process [here](https://www.moesif.com/docs/developer-portal/using-the-portal/).

## Verifying Key Provisioning Functionality

After configuring the rest of the developer portal you can verify Kong Konnect functionality after creating a key. In Kong, under **Consumers**, you should see your new user added. For this entry, you should also see the **custom_id** field with the Stripe customer ID as well (will resemble `cus_123abc`).
