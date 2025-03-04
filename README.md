# Moesif Developer Portal

The Moesif developer portal is an open-source app that you can deploy to provide a self-service experience for customers to subscribe and pay for your APIs. The developer portal is for API product owners looking to productize and monetize APIs.

As an open-source project, you can customize the brand and user experience to meet your requirements without fear of vendor lock-in.

![Screenshot of Moesif Developer Portal](https://www.moesif.com/docs/images/docs/developer-portal/dev-portal-products-and-plans.png)

## Overview

There are two main components

- `my-dev-portal` is a React based frontend for customers to subscribe to APIs
- `my-dev-portal-api` is a Node.js API to communicate with the Moesif APIs and Billing APIs in a secure environment.

> As of December 2024, the Moesif developer portal is now Generally Available and ready for production use. If you are using an early version, we recommend merging the latest changes for production readiness.

## Production Readiness

Before going to production, you should confirm a few things:

1. Ensure APIs are secured using HTTPS
2. Ensuring all keys stored securely in a keystore
3. Customize the CSS for your brand
4. Check assumptions in the DATA-MODEL.md, if your data mapping needs is different, you may want to adjust the code according.

## Supported Solutions

Below are the currently supported solutions in the developer portal. They may be used in any combination and we are continuing to add support for additional platforms regularly.

### Identity / Access Management

- Auth0
- Okta

### Payment Provider

- Stripe

### APIM / Key provisioning service

- Auth0 Machine2Machine
- JWT
- AWS API Gateway
- Kong
- Tyk

![Architecture Diagram of Moesif Developer Portal](https://raw.githubusercontent.com/Moesif/moesif-developer-portal/main/my-dev-portal/src/images/assets/dev-portal-architecture-diagram.svg)

## Prerequisites

In order to set up and use the Moesif Developer Portal, you will need the following:

- An active Identity Provider account
- An active payment provider account
- A running APIM / API service to provision keys
- An active Moesif account

Below is a step-by-step guide on how to set up the Moesif Developer Portal. Since there are a lot of moving parts, it’s suggested that you follow each step carefully and in the order that they are presented.

## Configuring the Developer Portal

### 1. Configuring Identity Provider

In order for new customers to sign up, you must configure an identity provider. Moesif supports two identity providers:

- [Configure the portal with Auth0](https://www.moesif.com/docs/developer-portal/configuring-auth0-as-an-identity-provider/)
- [Configure the portal with Okta](https://www.moesif.com/docs/developer-portal/configuring-okta-as-an-identity-provider/)

### 2. Configuring Billing Provider

In order for new customers to purchase paid plans with a credit card, you must configure a billing provider. Currently, Stripe is the only supported billing provider. However, the portal can be modified for alternate checkout flows.

- [Configure Stripe as the billing provider](https://www.moesif.com/docs/developer-portal/configuring-stripe-as-a-billing-provider/)

### 3. Configuring API Management or Provisioning Plugin

Lastly, you'll need to configure a service to generate API keys. This enables new sign ups to access your APIs and meter their usage.
The developer portal has plugins for many different provisioning flows including popular API gateways like Kong along with standards like Json Web Tokens (JWT)

The plugins are available in the `./plugins` directory of the repository. Instructions are below:

- [Configure Auth0 Machine2Machine plugin](https://github.com/Moesif/moesif-developer-portal/tree/main/plugins/auth0-m2m) as the key provisioning service
- [Configure JWT plugin](https://github.com/Moesif/moesif-developer-portal/tree/main/plugins/jwt) as the key provisioning service
- [Configure Kong Gateway plugin](https://github.com/Moesif/moesif-developer-portal/tree/main/plugins/kong-gateway) as the key provisioning service
- [Configure Kong Konnect plugin](https://github.com/Moesif/moesif-developer-portal/tree/main/plugins/kong-konnect) as the key provisioning service
- [Configure Tyk plugin](https://github.com/Moesif/moesif-developer-portal/tree/main/plugins/tyk) as the key provisioning service

### Building Your Own Provisioning Plugin

You can also implement your own logic to generate API keys. For more information, see [Build Your Own Key Provisioning Plugin](http://moesif.com/docs/developer-portal/setup-custom-provisioning/#build-your-own-key-provisioning-plugin).

## Running the Portal

There are two docker images available to run:

- `moesif/dev-portal` runs the frontend
- `moesif/dev-portal-api` runs the backend

To run the docker examples, modify the envvars in `distribution/docker/docker-compose.yml` and then run it as:

`docker-compose up -d`

### Source Code Layout

Within the project, you will see two subfolders: `my-dev-portal` and `my-dev-portal-api`. For the project to work, both applications must be running.

The `my-dev-portal` folder is a React application that contains the UI and logic for the developer portal. Any additions to the UI, styling or branding changes, and other user-facing changes will be done within this folder/project.

The `my-dev-portal-api` project is where the APIs and various other logic are contained. In this project, you’ll have connectivity to Moesif, Stripe, and Kong through various APIs. For example, the `/register` endpoint in this project contains the logic used to register a new user in the various systems that are part of the developer portal ecosystem.

In addition, the `plugins` directory contains various plugins to provisions API keys such as for JWT and Kong.

The `resources` directory contains additional files such as for AWS API Gateway

### Setting up the .env File

Each of the projects in the developer portal, `my-dev-portal` and `my-dev-portal-api`, require a `.env` file to function. In the .env file, various API keys and other credentials are stored. Of course, when moving to production you may want to move these from the .env file and into a more secure secrets management system.

In the root of both the `my-dev-portal` and `my-dev-portal-api` projects, create a .env file. In each project, there is a **.env.template** file that shows the variables that you need to add. You can copy and paste these contents into the new `.env` files created in each of the projects.

### Starting the Developer Portal

Now that everything is configured, it’s time to start up the Developer portal. This will require starting up both the UI and the API projects.

First, in a terminal that is pointing to the `./my-dev-portal-api` directory in the project, you’ll run:

```shell
node app.js
```

This will start up our API project.

Secondly, we will start up our UI project by opening another terminal at the `./my-dev-portal` directory and running:

```shell
npm start
```

Once it has started, your browser will open up the Developer Portal on `http://127.0.0.1:4000`. Next, you can move on to testing the Moesif Developer Portal to make sure all parts are working as expected.

## Testing the Moesif Developer Portal

Testing out all of the moving parts of the Developer Portal is crucial to making sure everything is working as intended. A lot is going on across multiple platforms so it makes sense to double-check that nothing was missed during the setup process.

To start, navigate to your developer portal in the browser, and at the Home Screen of the Developer Portal click the **Sign Up** button in the top right. On the form that appears, create your user, select a product, and complete the checkout process, and then you should land in the **Dashboard** screen of the Developer Portal. At this point, you can confirm a few things that apply to your setup:

## Building Docker Image

You can deploy the two components (the frontend and the API) from the Docker images available.
To build the Docker images:

1. cd into `./distribution/docker`
2. Run `./build.sh`

You'll see two images built. You can then run both via the compose file:

`docker-compose up -d`

## Next Steps

Next, in the Moesif Developer Portal, click on the **Keys** menu item at the top of the screen and open the **Keys** screen. On the **Keys** screen, click the Create Key button and generate an API key. Next, create an API request in Postman or Insomnia and attach the API key to the header. Once the API request is sent and the response is received, we can confirm a few more things:

In **Moesif**, in the **Live Event Log**, you should see your API call logged. You should also see, to the far right of the request entry, that your user’s Stripe customer ID and subscription ID are attached to the request.

Within the next 5 minutes, you should also see in Stripe that API call usage has been attached to the user subscription. This can be done by going to the **Customers** screen, clicking on the customer, and on the customer profile screen that appears, clicking on the **Subscriptions** entry for the subscription where the usage will be billed. Inside the subscription details screen, you’ll see under the **Pricing** header an entry and a link for **View usage**. This should reflect the API call usage.

A last step you can do is also do the [**Meter Test**](https://www.moesif.com/docs/metered-billing/testing-billing-meters/) to ensure that all parts of the billing meter setup are working correctly.

Depends on how you deploy the `my-dev-portal-api`, weather you decides to use API gateway or not, you will want to make sure these
APIs are protected so that they can only be called by `my-dev-portal` UI.

With all parts of the ecosystem working properly, the Moesif Developer Portal can be released to your users!
