# moesif-developer-portal

This is an open-source developer portal project using Moesif, Stripe, Auth0 or Okta, and Kong as backends to monetize APIs (more backends to come). You can deploy the dev portal so customers can subscribe to your APIs and purchase a plan. This project is a great starting place to quickly build your own developer experience. As an open-source project on GitHub, you can customize the portal to your needs without being worried about lock-in or lack of customization. See guide on [setting up the Moesif Developer Portal](https://www.moesif.com/docs/guides/setting-up-the-moesif-developer-portal/).

In order to set up and use the Moesif Developer Portal, you will need the following:

- An active Auth0 or Okta account
- An active Stripe account
- An active Moesif account
- A running Kong instance

Below is a step-by-step guide on how to set up every single aspect of the Moesif Developer Portal. Since there are a lot of moving parts, it’s suggested that you follow each step carefully and in the order that they are presented. First on the docket is getting Kong integrated with Moesif.

## Integrating Moesif and Kong

The Moesif Developer Portal, in its current state, requires a running instance of Kong. In our demonstrations, we are using Kong Enterprise Edition running on Docker.

To integrate Moesif and Kong, you can follow our guide that covers [integrating Moesif and Kong in detail](https://www.moesif.com/docs/guides/guide-kong-gateway-integration/). Alternatively, you can also check out [our integration documentation for Kong](https://www.moesif.com/docs/server-integration/kong-api-gateway/) if you’re already an experience Kong user. Once you have the integration set, you’ll be ready to move to the next step in the Moesif Developer Portal setup process.

## Creating an Endpoint in Kong Manager

This next step will require you to set up an endpoint in Kong. If you already have an endpoint created, feel free to skip ahead to the next step in the guide.

If you are using Kong Manager, you can create the endpoint by clicking **Services** in the left-side menu, under the **API Gateway** section. On the **Services** page, click the **New Service** button in the top-right corner to add a new service.

On the **Create Service** page, You will need to fill out the **Name** and, after selecting the **Add using URL** option, the **URL** field. For this example, you can fill them out with the following values:

**Name**: `HttpBin`

**URL**: `https://www.httpbin.org`

Once populated, click **Create** to create the service. After this, you’ll see your new services viewing page.

Next, we will create a route that will expose this service. To do this, click on **Routes** in the left-side menu, which is also under the **API Gateway** section.

On the **Routes** page, click on the **Create Route** button in the top-right corner of the screen to add the new route. On the **Create Route** screen, you’ll have a few values to fill out including the **Service, Name**, **Protocols**, **Method(s)**, and **Path(s)** fields on the screen. For this example, you can fill out these fields with the following values:

**Service**: Choose the Service you just created, `HttpBin`

**Name**: `TestService`

**Protocols**: `http, https`

**Method(s)**: `GET`

**Path(s)**: `/test-service`

Once populated, click **Create** to create the route. After this, you’ll see your new routes viewing page. With the endpoint creation complete, we can now move on to testing it to ensure it is configured correctly.

### Testing the Endpoint

To test your newly created endpoint, you’ll want to use a tool like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/). Alternatively, you could also just use a browser at this point too. In your tool, add your endpoint URL which will look like `{KONG_URL}:PORT/test-service/` and send a GET request. If you are running Kong in Docker and have set up the endpoint as shown above, your URL will look like `localhost:8000/test-service/`.

After the request has been sent, you should see a `200 OK` response as well as a response body containing the HttpBin contents (essentially a webpage). With our endpoint working, now let’s move on to securing it with an API key.

## Adding Key Auth to All Kong Endpoints

Our next step is to add the **Key-Auth** plugin to our Kong endpoint. For simplicity, we will enable this plugin globally but if in the future you want to only apply it to specific routes, you can do that.

In the Kong Manager Dashboard, you can add the plugin by clicking **Plugins** in the left-side menu, under the **API Gateway** section. On the **Plugins** page, you’ll click the **New Plugin** button to add a new plugin. On the **Add New Plugin** screen, you’ll find the **Key-Authentication** plugin by scrolling or searching, once found, click **Enable**.

On the **Create new key-auth plugin** screen, you’ll want to make sure that the **This plugin is Enabled** toggle is set to `on`, the **Global** radio button is selected, and that **Config.Key Names** field is set to `apikey`. By setting this to `apikey` we can pass a field of the same name in the header and include our API key as the value.

Lastly, to save our plugin configuration, scroll down to the bottom of the screen and click **Create**. Now, our endpoint will be secured by the kay-auth plugin. To test it out, resend the request from earlier and you should get a `401 Unauthorized` response, and a message body stating `No API key found in request`. If you are not getting this response, please refer to the [Kong documentation for key-auth](https://docs.konghq.com/hub/kong-inc/key-auth/).

## Download the Source Code

Now it’s time to pull down the source code for the Moesif Developer portal. Using [git](https://git-scm.com/), you’ll want to clone the [Moesif Developer Portal repository](https://github.com/Moesif/moesif-developer-portal) to your local machine. If you’re unfamiliar with how to clone a git repository, check out the [GitHub guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) on how to do so.

Once the code is pulled down, open up your favorite code editor or IDE and open up the project.

### Source Code Layout

Within the project, you will see two subfolders: `my-dev-portal` and `my-dev-portal-api`. For the project to work, both applications must be running.

The `my-dev-portal` folder is a React application that contains the UI and logic for the developer portal. Any additions to the UI, styling or branding changes, and other user-facing changes will be done within this folder/project.

The `my-dev-portal-api` project is where the APIs and various other logic are contained. In this project, you’ll have connectivity to Moesif, Stripe, and Kong through various APIs. For example, the `/register` endpoint in this project contains the logic used to register a new user in the various systems that are part of the developer portal ecosystem.

## Setting up the .env File

Each of the projects in the developer portal, `my-dev-portal` and `my-dev-portal-api`, require a **.env** file to function. In the .env file, various API keys and other credentials are stored. Of course, when moving to production you may want to move these from the .env file and into a more secure secrets management system.

In the root of both the `my-dev-portal` and `my-dev-portal-api` projects, create a .env file. In each project, there is a **.env.template** file that shows the variables that you need to add. You can copy and paste these contents into the new **.env** files created in each of the projects.

In the `my-dev-portal/.env` file, you should have the following key/value pairs:

```shell
REACT_APP_STRIPE_PRICING_TABLE_ID = 'prctbl_123abc'
REACT_APP_STRIPE_PUBLISHABLE_KEY = 'pk_test_123abc'
REACT_APP_STRIPE_AUTH_KEY = 'Bearer sk_test_123abc'
REACT_APP_DEV_PORTAL_API_SERVER = 'http://127.0.0.1:3030'
REACT_APP_AUTH0_DOMAIN = 'yoururl.us.auth0.com'
REACT_APP_AUTH0_CLIENT_ID = 'your Auth0 client ID'
REACT_APP_OKTA_ORG_URL="https://yoururl.okta.com/oauth2/default"
REACT_APP_OKTA_CLIENT_ID="Your Okta Client ID"
```

The only value we need to set in this **.env** file currently is the `REACT_APP_DEV_PORTAL_API_SERVER` value. This should be set to the URL and port where our `my-dev-portal-api` project will be deployed. If you’re running this locally and using the default configuration, this value can stay as it is. If you are running your API project on another URL or port, you can change this value to match.

All the other values in this file will be filled in as we work through the remainder of the guide.

In the `my-dev-portal-api/.env` file, you should have the following key/value pairs:

```shell
STRIPE_KEY = 'sk_test_123abc'
MOESIF_APPLICATION_ID = 'your Moesif application ID'
MOESIF_MANAGEMENT_TOKEN = 'your Moesif management token'
MOESIF_TEMPLATE_WORKSPACE_ID_LIVE_EVENT_LOG = 'workspace ID'
MOESIF_TEMPLATE_WORKSPACE_ID_TIME_SERIES = 'workspace ID'
KONG_URL = 'http://localhost:8001'
OKTA_DOMAIN="https://you-okta-url.okta.com/"
OKTA_API_TOKEN="Okta API Token"
OKTA_APPLICATION_ID="Okta App/Client Id"
```

The only values we need set in this **.env** file currently will be the `KONG_URL` and `MOESIF_APPLICATION_ID`.

For the `KONG_URL`, If you’re running a local instance of Kong, by default this should be running on `http://localhost:8001`. If this is the case, you can leave the value as is. If it is different or running remotely, you can change the value to point to your Kong gateway.

For the `MOESIF_APPLICATION_ID`, Your **Moesif Application ID** value is found in Moesif by going to the menu link in the bottom-left of the screen (which will show your name) and selecting **API Keys**. The key will then be on the page that appears under **Collector Application Id**.

As with the previous **.env** file, All the other values in this file will be filled in as we work through the remainder of the guide.

## Adding Kong APIM to the Moesif Developer Portal

Now that We have our endpoints in Kong set up and our base developer portal code pulled down, we can start to get analytics flowing into Moesif from Kong. The Moesif-Kong plugin makes it easy to get API call analytics funneled into Moesif. For instructions on how to do this, you can reference [our integration documentation](https://docs.konghq.com/hub/moesif/kong-plugin-moesif/) or a more in-depth step-by-step approach in [our integration guide](https://www.moesif.com/docs/guides/guide-kong-gateway-integration/).

Once the integration is complete, you should begin to see some API call metrics flowing into Moesif. Even if you are being blocked by the **key-auth** plugin in Kong, the `401 Unauthorized` responses will still show up in Moesif. Once the integration is confirmed, you can move to the next step and create the Auth0 or Okta app to be used with the Moesif Developer Portal.

## Creating the app within your Identity Provider
### Creating the Auth0 App (If Using Auth0)

With the Moesif Developer Portal you can use Auth0 for controlling access and user management. Of course, the open-source code could be tweaked to support other identity providers as well. 

To configure Auth0 to work with the portal, you will need to create an **Auth0 Application**. To do this, log into Auth0, and from the left-side menu click on **Applications** and select **Applications**. From the **Applications** page, click the **Create Application** button.

In the modal that appears, fill in the **Name** field with a value such as `Developer Portal` and select **Single Page Application** as the **Application Type**. After these selections are made, click **Create**.

On the next page that appears, select the **Settings** tab. In the settings tab, scroll down to the **Application URIs** section. In this section you’ll need to add `http://127.0.0.1:3000`, or the URL where your developer portal will be hosted, as an entry for **Allowed Callback URLs**, **Allowed Logout URLs**, and **Allowed Web Origins**.

Once added, scroll to the bottom of the page and click **Save Changes** to save your application’s settings.

### Creating the Okta App (If Using Okta)
With the Moesif Developer Portal you can use Okta for controlling access and user management. Of course, the open-source code could be tweaked to support other identity providers as well. 

To configure Okta to work with the portal, you will need to create an **Okta Application** for the dev portal. To do this, log into Okta, and from the left-side menu click on **Applications** and select **Applications**. From the **Applications** page, click the **Create App Integration** button.

In the modal that appears, Under **Sign-in method** select the **OIDC - OpenID Connect** option. In the **Application type** selection that appears, select **Single-Page Application** and click **Next**.  

On the next page that appears, fill in the **App integration name** field with a value such as `Developer Portal`. Under **Grant type**, make sure `Authorization Code` and `Refresh Token` are selected. Then, Under the **Sign-in redirect URIs** section, add in the correct values, if you're running this locally, and example value would be `http://127.0.0.1:3000/login/callback`. You'll also want to add a similar value under the **Sign-in redirect URIs**, like `http://127.0.0.1:3000/`. Lastly, under **Assignments**, select `Skip group assignment for now` (unless you want to set this). Once added, scroll to the bottom of the page and click **Save** to save your application’s settings. 

## Adding the Identity Provider to the Moesif Developer Portal
### Adding Auth0 to the Moesif Developer Portal

In the `my-dev-portal/.env` file, we will add the correct values for both the `REACT_APP_AUTH0_DOMAIN` and `REACT_APP_AUTH0_CLIENT_ID` entries. In the **.env** file, we will replace the following lines:

```shell
REACT_APP_AUTH0_DOMAIN = 'yoururl.us.auth0.com'
REACT_APP_AUTH0_CLIENT_ID = 'your Auth0 client ID'
```

In Auth0, navigate to the **Applications** screen and select the application you are using for the Developer Portal. Under the **Settings** tab, copy the value under **Domain** and add it to the
value under `REACT_APP_AUTH0_DOMAIN` in the **.env** file. Next copy the **Client ID** value and add it as the value for the `REACT_APP_AUTH0_CLIENT_ID` entry in the **.env** file.

Once both values are added, save the file to make sure the updated values are persisted. Next, we will move on to creating our products in Stripe so that they can be used in the Developer Portal.

### Adding Okta to the Moesif Developer Portal
#### For frontend
In the `my-dev-portal/.env` file, we will add the correct values for both the `REACT_APP_AUTH0_DOMAIN` and `REACT_APP_AUTH0_CLIENT_ID` entries. In the **.env** file, we will replace the following lines:

```shell
REACT_APP_OKTA_ORG_URL="https://yoururl.okta.com/oauth2/default"
REACT_APP_OKTA_CLIENT_ID="Your Okta Client ID"
```

To get these values, in the Okta console, navigate to the **Applications** screen and select the application you are using for the Developer Portal. Copy the **Client ID** value and add it as the value for the `REACT_APP_OKTA_CLIENT_ID` entry in the **.env** file. For the `REACT_APP_OKTA_ORG_URL` you'll use the domain where your Okta app is running and add `/oauth2/default`. IF you're just using a dev instance, the result will be something like `"https://dev-123456.okta.com/oauth2/default`.

Once both values are added, save the file to make sure the updated values are persisted. Next, we will move on to creating our products in Stripe so that they can be used in the Developer Portal.

#### For backend
In the `my-dev-portal-api/.env` file, we will add the correct values for both the `OKTA_DOMAIN`, `OKTA_API_TOKEN`, and `OKTA_APPLICATION_ID` entries. In the **.env** file, we will replace the following lines:

```shell
OKTA_DOMAIN="https://you-okta-url.okta.com/"
OKTA_API_TOKEN="Okta API Token"
OKTA_APPLICATION_ID="Okta App/Client Id"
```

First, fill in the `OKTA_DOMAIN` with the same value we used in the `REACT_APP_OKTA_DOMAIN` in the frontend **.env** but without the `/oauth2/default` route attached. Next, generate an API token (as described [here](https://developer.okta.com/docs/guides/create-an-api-token/main/)), and add the value as the `OKTA_API_TOKEN`. Lastly, add the same **Client ID** value we used in the frontend **.env** to the value for `OKTA_APPLICATION_ID`.

Once all three values are added, save the file to make sure the updated values are persisted. Next, we will move on to creating our products in Stripe so that they can be used in the Developer Portal.
## Creating API Products in Stripe

The next step we will take is to create a product and price in Stripe. It’s best to do this step before you integrate Stripe into Moesif so you’ll already have some pricing plans for Moesif to pull in. A pricing plan can then be associated with specific billing criteria set up within a Billing Meter in Moesif.

To create a product and price, log into Stripe and proceed to the **Products** page from the header menu in the Stripe UI. Once on the **Products** page, click on the **Add Product** button in the top right corner.

In the **Add a Product** modal that appears, you’ll be able to add the details for your product and the price(s) for it. The form for your product will have a few fields to fill out. Some of these fields include:

- **Name**
  - This is the name of your product. In the example below, we use the name “My API”.

- **Description**
  - This field is optional but you could put a brief description of the product here. In the example below, we use a description of “This is a monetized API”.

- **Pricing model**
  - A few different pricing models can be set up in Stripe. These pricing models include:

    - _Standard pricing_
      - use this if you want to charge the same price for each API call.
    - _Package_
      - use this if you charge for API usage by the package or a group of units. For example, you could set it up to charge $10 for every 1000 API calls. Every time the user goes over the 1000 API call threshold, they are charged another $10.
    - _Graduated_
      - use graduated pricing tiers that may result in a different price for some units in an order. For example, you might charge $10.00 per unit for the first 100 units and then $5.00 per unit for the next 50. Today, this is only available for recurring prices.
    - _Volume_
      - use if you charge the same price for each unit based on the total number of units sold. For example, you might charge $10.00 per unit for 50 units, and $7.00 per unit for 100 units.

- **Price**
  - Depending on the pricing model selected, prices can be set in this field.

- **Billing period**
  - The billing period can be set as:

    - Daily
    - Weekly
    - Monthly
    - Every 3 months
    - Every 6 months
    - Yearly
    - Customer

  - For your configuration with Moesif, we recommend setting the billing period as Monthly. You’ll also need to check the **Usage is metered** box as well.

- **Charge for metered usage by**
  - Once the **Usage is metered** checkbox is selected, the option for **charge for metered usage by** will appear. This field lets you choose how metered usage will be calculated and charged for. Values available for this field are:

    - _Sum of usage values during period_
      - Users are charged for their usage recorded throughout the billing cycle
    - _Most recent usage value during period_
      - Users are charged based on the last usage recorded before the billing period ended
    - _Most recent usage value_
      - Users are charged for the last usage recorded throughout the subscription’s life at the end of each billing cycle
    - _Maximum usage value during period_
      - Users are charged for the highest amount recorded during the billing cycle

  - The optimal setup for a Moesif Billing Meter is to set this value as **Sum of usage values during period** since usage is reported hourly by Moesif to Stripe

- **Price description**
  - This is an optional field but recommended. Here you can put a brief description of your price. This will allow you to more easily decipher which price you are selecting in the billing meter in Moesif, especially if you have multiple prices for a single product.

Once you’ve input all of the details for your product and price, you can click **Save product** in the top right corner of the screen. This product and price will now be saved. Follow this same procedure to create more products as needed. As you create products, you will be able to view and edit them on the **products** screen.

## Integrating Moesif and Stripe

Once your products and prices are created, it's time to begin to integrate Stripe with Moesif. To begin configuring Stripe in Moesif, go to the **Billing Meters** screen by clicking on **Billing Meters** in the left-side menu. On the **Billing Meters** screen, click the **Edit Billing Provider** dropdown in the top right corner of the screen and select **Stripe**.

This will bring up the Stripe configuration screen to walk you through the integration. From this screen, you can get all of the info needed to plug Stripe into Moesif. Each step for configuration is covered within the modal. The below sections go into more detail if required.

### Add the Moesif Webhook to Stripe

The first step in the integration is to add the Moesif webhook into the Moesif configuration for Stripe. Adding this allows Stripe to send subscription updates to Moesif.

To add the Moesif webhook to Stripe, in the Stripe dashboard, click on **Developers** in the upper right-hand side, and then **Webhooks** in the left-side menu. This will bring you to the **Webhooks** page where you can view existing webhooks and add new ones. To add a new webhook we will click the **Add an endpoint** button at the bottom of the screen.

From here, plug in the Moesif API endpoint URL and configure the events to listen to. You’ll want to copy your Moesif Webhook URL, shown in the **Stripe Settings** modal displayed in Moesif, into the **Endpoint URL** field. After this, click the **Select Events** button.

On the **Select events to send** screen, Scroll to the **Customer** section and select the option for **Select all Customer events**. After this, click the **Add events** button at the bottom of the screen. After this, you’ll be returned to the original screen where you added the endpoint details. Scroll to the bottom of the screen and click **Add endpoint** to save the webhook endpoint to Stripe.

### Plug the Stripe API Details into Moesif

For Moesif to add usage quantities to subscriptions in Stripe, we need to add the Stripe API details into Moesif. This is done in the Stripe configuration screen in Moesif. Currently, Moesif only supports version **2020-08-27** of the Stripe API so that field defaults for the **Stripe API Version** field.

For the **Stripe API Key** field in **Stripe**, you’ll need to retrieve the API key from Stripe to plug it in. In Stripe, from the **Developers** screen click on **API Keys** in the left-side menu. You’ll then be able to see the private key for your API in either the **Secret key** or a generated **Restricted keys** field on the screen. Either key can be copied and used.

After copying the key from Stripe, paste the key into the **Stripe API Key** field on the **Stripe Configuration** screen in Moesif. After setting the API key value, scroll down to the bottom of the screen and click **Save** to save the configuration in Moesif. At this point, your Stripe integration is complete in Moesif and you can begin to use it.

## Setting up a Billing Meter in Moesif

Once you have the Stripe integration active in Moesif, you can begin to set up your billing meter. Billing meters created in Moesif do two things: track usage based on specific criteria and report that usage to the billing provider. Moesif allows you to set up very simple and very complex billing meters with relative ease.

To create the Billing Meter, in Moesif you will navigate to the Billing Meter screen. You can do this from the left-side menu by clicking the **Billing Meters** menu item. Once on the **Billing Meters** screen, you’ll then click **Add Billing Meter** in the top-right corner of the screen.

The next screen to appear will be the **Create Billing Meter** screen where you can create and input the criteria for your Billing Meter.

Fields on this screen include:

- **Billing Meter Name**
  - This is the Moesif internal name of your new Billing Meter

- **Billing Provider**
  - In this dropdown, you can choose the billing provider you want to send your usage metrics.

- **Product**
  - Here you can choose which product that you’ve set up in Stripe your usage metrics should be tied to.

- **Price**
  - In the last field in the Billing Provider settings for the Billing Meter, you will choose which price you want to tie your usage metrics to.

- **Filters**
  - Under the Filters configuration, you will configure your billing criteria to only include requests that fit certain criteria.

- **Metrics**
  - Here you can choose which metric you would like to bill on. Available options include:

    - **Volume > Event Count**
      - This will increment usage for every event that fits the criteria outlined in the Filter criteria.

    - **Uniques > Users**
      - This will increment usage whenever a unique user sends a request that fits the Filter criteria. For every unique user, the count will be incremented by 1 regardless of the event count for that user.

    - **Uniques > Sessions/API Keys**
      - This will increment usage whenever a unique session or API key is used to send a request that fits the Filter criteria. For every unique session or API key, the count will be incremented by 1 regardless of the event count for that particular session or API key.

> There are other options under **Metrics**, including customer metrics, as well but the above 4 tend to be the most applicable to usage-based billing.

As an example, you can create a Billing Meter that will filter traffic for a single endpoint and where requests received a successful `HTTP 200` response. We will use the **Event Count** metric to make sure that every request is added to the tally and sent to the billing provider.

For the example above, the billing meter will be configured as shown below.

<p class="docs-image">
  <img class="lazyload blur-up" data-src="{{site.baseurl}}/images/guides/2400/billing-meter-inputs-example.png" alt="Moesif Billing Meter Example">
</p>

Once your meter is set, click **Create**. This will create and activate the Billing Meter. After the meter is created, you will be prompted to do a **Meter Test**. The **Meter Test** will check connectivity with Stripe and that the meter is reporting usage as expected to the correct subscription. For now, we will forego the **Meter Test** and run it manually when we have the ability to create subscriptions and API keys. From here, we will continue to set up the necessary components to get the Moesif Developer Portal operational.

## Creating the Stripe Pricing Table

During the sign-up flow in the Developer Portal, the user will be prompted for which subscription/product they would like to subscribe to. In order to make this easy to manage, the Moesif Developer Portal uses a Stripe Pricing Table to display the available options and handle the checkout.

To set up the Pricing Table, navigate to the **Products** page within Stripe. Once on the **Products** page, in the tabs available below the main menu, select **Pricing tables**. Once on the **Pricing tables** tab, click on the **Create pricing table** button in the top-right.

For the next steps, follow the Stripe documentation on [how to create a pricing table](https://stripe.com/docs/payments/checkout/pricing-table#Create). For each of the entries added to the **Pricing Table**, on the **Payment settings** page under the **Confirmation page** section, select `Don’t show confirmation page` and fill in the URL with `http://127.0.0.1:3000/dashboard?checkout-session={CHECKOUT_SESSION_ID}`. By doing this, when payments are completed, the user will be redirected back to the developer portal, and the `CHECKOUT_SESSION_ID` will be used to retrieve Stripe account details upon redirect.

After the pricing table is created, you’ll get an embeddable snippet of code. This code will look similar to this:

```javascript
<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
<stripe-pricing-table pricing-table-id="prctbl_123abc" publishable-key="pk_test_abc123">
</stripe-pricing-table>
```

In the `my-dev-portal/.env` file, we will add the values from the code including the `pricing-table-id` and `publishable-key` values. To do this, take these values and add them to the values in the **.env** file.

```shell
REACT_APP_STRIPE_PRICING_TABLE_ID = 'prctbl_123abc'
REACT_APP_STRIPE_PUBLISHABLE_KEY = 'pk_test_123abc'
```

Once added, save the **.env** file and move to the next step of adding the other Stripe configuration details to the Moesif Developer Portal.

## Adding Stripe to the Moesif Developer Portal

Adding Stripe to the Moesif Developer Portal will require adding some details to the .env files in both the UI and API projects within the developer portal.

In the `my-dev-portal/.env` file, you will need to add a value for the `REACT_APP_STRIPE_AUTH_KEY` entry. This key can be accessed by logging into Stripe and clicking on the **Developers** link in the top-right of the screen. On the **Developers** screen, click on **API Keys** in the left-side menu. You’ll then be able to see the private key for your API in either the **Secret key** or a generated **Restricted keys** field on the screen. Either key can be copied and used.

```shell
REACT_APP_STRIPE_AUTH_KEY = 'Bearer sk_test_123abc'
```

> It’s important that you preface the key with `Bearer` for the key to work correctly with the developer portal.

In the `my-dev-portal-api/.env` file, you’ll also need to add the same value to the `STRIPE_KEY` entry.

```shell
STRIPE_KEY = 'sk_test_123abc'
```

Once the values are added, save the **.env** files and move to the next step in the developer portal configuration.

## Creating and Adding the Embedded Templates to the Moesif Developer Portal Dashboard

In the **Dashboard** page of the Developer Portal, users are able to see two charts that are sourced from Moesif: a Live Event log and a Time Series Chart. Both of these help the user to see how their usage is trending and individual details for each call. These charts are actually Moesif Embedded Templates, a feature that you can use to embed Moesif charts into your applications.

We will need to create each of the required charts in Moesif and plug the details into our **.env** file for the `my-dev-portal-api`. Let’s look at each step required below.

### Create the Live Event Log

In Moesif, click the **New** button in the top corner of the left-side menu and select **Live Event Log**. Once the **Live Event Log** is showing, click the **Embed/API** button in the top-right corner of the screen. In the **Embed/API Access** modal, under **Select Integration Type** select **Embed Template**. Then, in the **Template Name** field, give the template a name like “Live Event Log” and click the **Dynamic User Id** button in the **Sandbox Policy** section.

<p class="docs-image">
  <img class="lazyload blur-up" data-src="{{site.baseurl}}/images/guides/2400/embed-template-inputs.png" alt="Moesif Embed Template Inputs">
</p>

After everything is filled out, click **Get Embed Code**. You’ll then be presented with some embed code that you will need to plug into the **.env** file.

<p class="docs-image">
  <img class="lazyload blur-up" data-src="{{site.baseurl}}/images/guides/2400/embed-code-output.png" alt="Moesif Embed Template Code">
</p>

In the `my-dev-portal-api/.env` file, you’ll need to add values for `MOESIF_MANAGEMENT_TOKEN` and `MOESIF_TEMPLATE_WORKSPACE_ID_LIVE_EVENT_LOG`. The `MOESIF_MANAGEMENT_TOKEN` comes from the large token highlighted in the example above. The `MOESIF_TEMPLATE_WORKSPACE_ID_LIVE_EVENT_LOG` value is the shorter string, the **workspace id**, highlighted at the top of the above image.

```shell
MOESIF_MANAGEMENT_TOKEN = 'your Moesif management token'
MOESIF_TEMPLATE_WORKSPACE_ID_LIVE_EVENT_LOG = 'workspace ID'
```

Once the values are plugged in, save the **.env** file.

### Create the Time Series Chart

Still in Moesif, click the **New** button button again and select **Time Series**. Once the **Time Series** is showing, click the **Embed/API** button in the top-right corner of the screen. In the **Embed/API Access** modal, under **Select Integration Type** select **Embed Template**. Then, in the **Template Name** field, give the template a name like “Time Series” and click the **Dynamic User Id** button in the **Sandbox Policy** section. After everything is filled out, click **Get Embed Code**. You’ll then be presented with some embed code that you will need to plug into the **.env** file.

In the `my-dev-portal-api/.env` file, replace the value for `MOESIF_TEMPLATE_WORKSPACE_ID_TIME_SERIES` with the **workspace id** displayed in the **Embed Code** displayed for the Time Series:

```shell
MOESIF_TEMPLATE_WORKSPACE_ID_TIME_SERIES = 'workspace ID'
```

Once the value is added, save the **.env** file and move to the last step off actually starting up the Moesif Developer Portal.

## Starting up the Developer Portal

Now that everything is configured, it’s time to start up the Developer portal. This will require starting up both the UI and the API projects.

First, in a terminal that is pointing to the `/my-dev-portal-api` directory in the project, you’ll run:

```shell
node app.js
```

This will start up our API project.

Secondly, we will start up our UI project by opening another terminal at the `/my-dev-portal` directory and running:

```shell
npm start
```

Once it has started, your browser will open up the Developer Portal on `http://localhost:3000`. Because of how we have Auth0/Okta and Stripe configured, you’ll need to change that to `http://127.0.0.1` so that the platforms will recognize it as a valid URL. After changing the URL in the browser, you can move on to testing the Moesif Developer Portal to make sure all parts are working as expected.

## Testing out All the Moving Parts of the Moesif Developer Portal

Testing out all of the moving parts of the Developer Portal is crucial to making sure everything is working as intended. A lot is going on across multiple platforms so it makes sense to double-check that nothing was missed during the setup process.

To start, navigate to your developer portal in the browser, and at the Home Screen of the Developer Portal click the **Sign Up** button in the top right. On the form that appears, create your user, select a product, and complete the checkout process, and then you should land in the **Dashboard** screen of the Developer Portal. At this point, you can confirm a few things:

* If you're using Auth0, In **Auth0**, on the **User Management > Users** screen, you should see your newly created user present, tracked by their email.
* If you're using Okta, in the Okta console, on the **Directory > People** screen, you should see your newly created user present, tracked by their email.
* In **Stripe**, on the **Customers** screen, you should also be able to see your newly created user as well, tracked by their email. If you click on the customer, you should also be able to see their subscription. The subscription should match the one selected in the sign-up flow in the Developer Portal
* In **Kong**, under **Consumers**, you should also see your new user added. For this entry, you should also see the **custom_id** field with the Stripe customer ID as well (will resemble `cus_123abc`).

Next, in the Moesif Developer Portal, click on the **Keys** menu item at the top of the screen and open the **Keys** screen. On the **Keys** screen, click the Create Key button and generate an API key. Next, create an API request in Postman or Insomnia and attach the API key to the header. Once the API request is sent and the response is received, we can confirm a few more things:

In **Moesif**, in the **Live Event Log**, you should see your API call logged. You should also see, to the far right of the request entry, that your user’s Stripe customer ID and subscription ID are attached to the request.
Within the next 15 minutes, you should also see in Stripe that API call usage has been attached to the user subscription. This can be done by going to the **Customers** screen, clicking on the customer, and on the customer profile screen that appears, clicking on the **Subscriptions** entry for the subscription where the usage will be billed. Inside the subscription details screen, you’ll see under the **Pricing** header an entry and a link for **View usage**. This should reflect the API call usage.

A last step you can do is also do the [**Meter Test**](https://www.moesif.com/docs/metered-billing/testing-billing-meters/) to ensure that all parts of the billing meter setup are working correctly.

With all parts of the ecosystem working properly, the Moesif Developer Portal can be released to your users!
