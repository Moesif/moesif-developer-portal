const StripeSDK = require("stripe");
const stripe = StripeSDK(process.env.STRIPE_API_KEY);

function verifyStripeSession(checkout_session_id) {
  return fetch(
    `https://api.stripe.com/v1/checkout/sessions/${checkout_session_id}`,
    {
      headers: {
        Authorization: `bearer ${process.env.STRIPE_API_KEY}`,
      },
    }
  ).then((res) => res.json());
}

function getStripeCustomer(email) {
  return fetch(
    `https://api.stripe.com/v1/customers/search?query=email:"${encodeURIComponent(
      email
    )}"`,
    {
      headers: {
        Authorization: `bearer ${process.env.STRIPE_API_KEY}`,
      },
    }
  ).then((res) => res.json());
}

async function getStripeCustomerId(email) {
  const stripeCustomer = await getStripeCustomer(email);
  const stripeCustomerId =
    stripeCustomer.data && stripeCustomer.data[0]
      ? stripeCustomer.data[0].id
      : undefined;

  return stripeCustomerId;
}

module.exports = {
  verifyStripeSession,
  getStripeCustomer,
  getStripeCustomerId,
};
