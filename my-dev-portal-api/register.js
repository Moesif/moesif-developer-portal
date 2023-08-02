
const fetch = require("node-fetch");
const { Client } = require("@okta/okta-sdk-nodejs");
const { ManagementClient } = require('auth0');

export async function registerStripeCheckout(stripeCheckoutSession) {
  const email = stripeCheckoutSession.customer_email;
  const stripe_customer_id = stripeCheckoutSession.customer;
  const stripe_subscription_id = stripeCheckoutSession.subscription;

  var company = { companyId: stripe_subscription_id };
  moesifMiddleware.updateCompany(company);

  var user = {
    userId: stripe_customer_id,
    companyId: stripe_subscription_id,
    metadata: {
      email: email,
    },
  };
  moesifMiddleware.updateUser(user);

  if(apimProvider === "Kong") {
    var body = { username: req.body.email, custom_id: stripe_customer_id };
    await fetch(`${process.env.KONG_URL}/consumers/`, {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  } else if(apimProvider === "AWS") {
    const auth0 = new ManagementClient({
      token: process.env.AUTH0_MANAGEMENT_API_TOKEN,
      domain: process.env.AUTH0_DOMAIN,
    });

    // Find the user in Auth0 by their email
    const users = await auth0.getUsersByEmail(email);
    const user = users[0];

    // Update the user's app_metadata with the stripe customer ID
    await auth0.updateUser({
      id: user.user_id}, {
      app_metadata: {
        stripeCustomerId: stripe_customer_id,
        stripeSubscriptionId: stripe_subscription_id
      }
    });
  }
}
