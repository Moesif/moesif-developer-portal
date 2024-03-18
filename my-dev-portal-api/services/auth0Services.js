const { ManagementClient } = require("auth0");

async function updateAuth0UserAppWithStripeInfo({
  email,
  stripe_customer_id,
  stripe_subscription_id
}) {
  let url = `https://${process.env.AUTH0_DOMAIN}/oauth/token`;
  let auth0Token;

  let options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_MANAGEMENT_API_AUDIENCE,
      grant_type: "client_credentials",
    }),
  };

  auth0Token = await fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      auth0Token = result.access_token;
    })
    .catch((error) => console.error("Error:", error));

  const auth0 = new ManagementClient({
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    token: auth0Token,
    domain: process.env.AUTH0_DOMAIN,
  });

  // Find the user in Auth0 by their email
  const users = await auth0.getUsersByEmail(email);
  const user = users[0];

  console.log(`setting Auth0 variables for ${user.email}`);

  // Update the user's app_metadata with the stripe customer ID
  await auth0.updateUser(
    {
      id: user.user_id,
    },
    {
      app_metadata: {
        stripeCustomerId: stripe_customer_id,
        stripeSubscriptionId: stripe_subscription_id,
      },
    },
    function (err, user) {
      if (err) {
        console.log(err);
      }
      console.log(user);
    }
  );
}

modules.exports = {
  updateAuth0UserAppWithStripeInfo,
};
