# Configuring Kong Konnect

Kong Konnect offers a suite of tools and services for managing, securing, and optimizing your APIs and microservices. The Moesif Developer Portal can seamlessly integrate with Kong Konnect to enhance your API management capabilities.

We'll cover configuring Kong Konnect for the Developer Portal in this document.

## Setup the Gateway

If you haven’t already, sign up for Kong Konnect and log in to the Kong Konnect Portal. Once logged in, you can begin setting up your API Gateway to integrate with Moesif.

To get started, we recommend following our [Kong Konnect Docker Demo](https://github.com/Moesif/moesif-kong-konnect-docker-demo) for a streamlined setup.

## Prerequisites

- A running **Self-Managed Hybrid Kong Konnect Gateway**.
- A configured **Service** and **Route**.
- The **Moesif Kong Konnect plugin configured**.

## Configure the Gateway

### Adding the Key Authentication Plugin

To secure your endpoints, you can add the Key Authentication (keyauth) plugin and apply it globally to all routes.

1. Navigate to the **Gateway Manager** in the Kong Konnect Portal and select your **Control Plane**.
2. Go to the **Plugins** section and click on **New Plugin**.
3. Search for the **Key Authentication** plugin and select **Enable**.
4. Configure the plugin with default settings, or adjust the parameters based on your requirements.
    - We will assume that the plugin is applied **Globally** and **Key Names** is set to`apikey`.
    - We will include the provisioned api key from the developer portal in requests sent by including an `apikey` header.
5. Click **Save** to apply the plugin.

Once applied, every request to your endpoints will require an API key for authentication.

For more details, refer to the [Kong Key Authentication Plugin documentation](https://docs.konghq.com/hub/kong-inc/key-auth/).

## Configure the Developer Portal

### Retrieving Values

Log into Kong Konnect and navigate to the **Gateway Manager** select your control plane and take note of the following values under **About this Hybrid Control Plane**.

1 `PLUGIN_KONG_URL`
    - Locate the **Admin API** URL.
    - Copy the value and add `/core-entities` to the URL.
    - Use this value for `PLUGIN_KONG_URL`.
2. `PLUGIN_KONNECT_API_URL`
    - Locate the **Admin API** URL.
    - Take note of the base URL - will look like `https://us.api.konghq.com`.
    - Use this value for `PLUGIN_KONNECT_API_URL`.
3. `PLUGIN_KONNECT_API_VERSION`
    - Locate the **Admin API** URL.
    - Take note of the version number in the URL - will look like `v2`.
    - Use this value for `PLUGIN_KONNECT_API_VERSION`.
4. `PLUGIN_KONNECT_RUNTIME_GROUP_NAME`
    - Use the **Name** of the control plane.
    - Use this value for `PLUGIN_KONNECT_RUNTIME_GROUP_NAME`. By default, this is `default`.
5. `PLUGIN_KONNECT_PAT`
    - Navigate to your **Profile** in the Konnect UI and select **Personal Access Tokens**.
    - Generate a new token, providing a name and expiration date.
    - Copy the token and paste it into `PLUGIN_KONNECT_PAT`.

### Environment Variables for Node

If you are standing up each service in the Moesif Developer Portal individually using Node/NPM - in the `my-dev-portal-api` project, add the following environment variables to the `.env` file:

```shell
PLUGIN_APIM_PROVIDER="Kong"
PLUGIN_KONG_URL="{your-konnect-api-url}/{your-konnect-api-version}/control-planes/{your-control-plane-id}/core-entities"
PLUGIN_KONNECT_API_URL="https://us.api.konghq.com"
PLUGIN_KONNECT_API_VERSION="v2"
PLUGIN_KONNECT_RUNTIME_GROUP_NAME="default"
PLUGIN_KONNECT_PAT=""
```

Save the `.env` file to ensure the updated values are persisted.

## Environment Variables for Docker

If you are using the Docker Compose file included in the [Moesif Developer Portal repository](https://github.com/Moesif/moesif-developer-portal) or in the [Kong Konnect Docker Demo repository](https://github.com/Moesif/moesif-kong-konnect-docker-demo), add the following environment variables to the `docker-compose.yml` file:

```yaml
dev-portal-api:
  environment:
    - PLUGIN_APIM_PROVIDER=Kong
    - PLUGIN_KONG_URL={your-konnect-api-url}/{your-konnect-api-version}/control-planes/{your-control-plane-id}/core-entities
    - PLUGIN_KONNECT_API_URL=https://us.api.konghq.com
    - PLUGIN_KONNECT_API_VERSION=v2
    - PLUGIN_KONNECT_RUNTIME_GROUP_NAME=
    - PLUGIN_KONNECT_PAT=
```

Save the `docker-compose.yml` file to ensure the updated values are persisted.

## Testing the Developer Portal

Once the Developer portal is configured, testing out all of the moving parts of the Developer Portal is crucial. Doing this ensures that everything is working as intended. See our detailed testing process [here](https://www.moesif.com/docs/developer-portal/using-the-portal/).

## Verifying Key Provisioning Functionality via Kong Konnect

After completing the developer portal configuration, you can verify Kong functionality and key provisioning using Kong Konnect.

- In Kong Konnect, select **Gateway Manager** and then select your **Control Plane**.
- Select **Consumers** on the left navigation pane.
- You should see the `Username` and `Custom ID` associated with the user created in the Developer Portal.

### Verify the `custom_id` Field

Ensure that the consumer entry includes the `custom_id` field with the Stripe customer ID (e.g., `stripe_customer_ID`). This confirms that the user is successfully added, and key provisioning is functioning correctly.
