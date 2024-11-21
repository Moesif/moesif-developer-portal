const { ManagementClient } = require("auth0");

async function updateAuth0UserAppWithStripeInfo({
  email,
  stripe_customer_id,
  stripe_subscription_id
}) {
  const auth0 = new ManagementClient({
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
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

module.exports = {
  updateAuth0UserAppWithStripeInfo,
};
