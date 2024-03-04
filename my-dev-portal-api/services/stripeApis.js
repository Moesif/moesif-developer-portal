function verifyStripeSession(checkout_session_id) {
  return fetch(
    `https://api.stripe.com/v1/checkout/sessions/${checkout_session_id}`,
    {
      headers: {
        Authorization: `bearer ${process.env.STRIPE_API_KEY}`
      }
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
        Authorization: `bearer ${process.env.STRIPE_API_KEY}`
      }
    }
  ).then((res) => res.json());
}


module.exports = {
  verifyStripeSession,
  getStripeCustomer,
};

