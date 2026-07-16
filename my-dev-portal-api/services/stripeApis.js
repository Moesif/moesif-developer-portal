const StripeSDK = require("stripe");
const stripe = StripeSDK(process.env.STRIPE_API_KEY);

function verifyStripeSession(checkoutSessionId) {
  return stripe.checkout.sessions.retrieve(checkoutSessionId, {
    expand: ["customer", "subscription", "line_items.data.price.product"],
  });
}

async function getActiveStripeSubscription(email, authUserId) {
  const customers = await stripe.customers.search({
    query: `email:"${email.replace(/"/g, "\\\"")}"`,
    limit: 10,
  });
  const customer =
    customers.data.find(
      (candidate) => candidate.metadata?.authUserId === authUserId
    ) || customers.data[0];
  if (!customer) throw new Error("Stripe customer not found");

  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    status: "all",
    limit: 10,
  });
  const subscription = subscriptions.data.find((candidate) =>
    ["active", "trialing", "past_due"].includes(candidate.status)
  );
  if (!subscription) throw new Error("Active Stripe subscription not found");

  const price = subscription.items.data[0]?.price;
  if (!price) throw new Error("Stripe subscription price not found");

  const product =
    typeof price.product === "string"
      ? await stripe.products.retrieve(price.product)
      : price.product;

  return { customer, subscription, price, product };
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

// Developers: you might consider have something like reddis
// make id/mapping look up easier and faster
const EMAIL_TO_STRIPE_CUSTOMER_CACHE = {};

function getStripeCustomerIdFromCache(email) {
  return EMAIL_TO_STRIPE_CUSTOMER_CACHE[email];
}

async function getStripeCustomerId(email) {
  if (EMAIL_TO_STRIPE_CUSTOMER_CACHE[email]) {
    return EMAIL_TO_STRIPE_CUSTOMER_CACHE[email];
  }

  const stripeCustomer = await getStripeCustomer(email);
  const stripeCustomerId =
    stripeCustomer.data && stripeCustomer.data[0]
      ? stripeCustomer.data[0].id
      : undefined;

  if (stripeCustomerId) {
    EMAIL_TO_STRIPE_CUSTOMER_CACHE[email] = stripeCustomerId;
  }

  return stripeCustomerId;
}

async function createStripeCheckoutSession(email, priceId, quantity, authUser) {
  // make sure only one stripe customer per email
  let customerId = await getStripeCustomerId(email);

  if (!customerId) {
    // If no customerId exists, create a new one
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        // add the user id from identify provider to
        // stripe metadata for customer.
        // Because, an alternative approach is to tie
        // the identity provider's user id to stripe customer
        // and look up customer object using user_id instead of
        // email.
        authUserId: authUser?.sub,
      },
    });

    customerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: priceId,
        // for metered billing, do NOT include quantity
        quantity: quantity ? parseInt(quantity) || 1 : undefined,
      },
    ],
    customer: customerId,
    mode: "subscription",
    return_url: `http://${process.env.FRONT_END_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}&price_id=${priceId}`,
  });

  return session;
}

async function updateStripeCustomerIdentity(
  customerId,
  { moesifUserId, moesifCompanyId, auth0UserId, subscriptionId }
) {
  const metadata = {
    moesif_user_id: String(moesifUserId),
    moesif_company_id: String(moesifCompanyId),
    sn_user_id: String(moesifUserId),
    sn_organization_id: String(moesifCompanyId),
    authUserId: auth0UserId,
  };

  const customer = await stripe.customers.update(customerId, { metadata });

  // The subscription webhook fires before provisioning writes the customer
  // metadata, so Moesif can process the subscription without a company
  // mapping. Touching the subscription metadata afterwards emits
  // customer.subscription.updated, making Moesif reprocess it with the
  // mapping in place.
  if (subscriptionId) {
    await stripe.subscriptions.update(subscriptionId, { metadata });
  }

  return customer;
}

module.exports = {
  verifyStripeSession,
  createStripeCheckoutSession,
  updateStripeCustomerIdentity,
  getStripeCustomer,
  getStripeCustomerId,
  getStripeCustomerIdFromCache,
  getActiveStripeSubscription,
};
