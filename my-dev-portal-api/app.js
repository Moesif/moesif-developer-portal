const express = require("express");
const path = require("path");
require("dotenv").config({ path: [".env", ".env.template"] });
const bodyParser = require("body-parser");
const moesif = require("moesif-nodejs");
const cors = require("cors");
const fetch = require("node-fetch");
const { Client } = require("@okta/okta-sdk-nodejs");

const {
  verifyStripeSession,
  getStripeCustomer,
  getStripeCustomerId,
} = require("./services/stripeApis");
const {
  syncToMoesif,
  getInfoForEmbeddedWorkspaces,
  getPlansFromMoesif,
  getSubscriptionsForUserId,
} = require("./services/moesifApis");

const { authMiddleware } = require("./services/authPlugin");

const StripeSDK = require("stripe");
const { getApimProvisioningPlugin } = require("./config/pluginLoader");

const app = express();
app.use(express.static(path.join(__dirname)));
const port = 3030;

const moesifManagementToken = process.env.MOESIF_MANAGEMENT_TOKEN;
const templateWorkspaceIdLiveEvent =
  process.env.MOESIF_TEMPLATE_WORKSPACE_ID_LIVE_EVENT_LOG;
const templateWorkspaceIdTimeSeries =
  process.env.MOESIF_TEMPLATE_WORKSPACE_ID_TIME_SERIES;

var jsonParser = bodyParser.json();

if (!moesifManagementToken) {
  console.error(
    "No MOESIF_MANAGEMENT_TOKEN found. Please create an .env file with MOESIF_MANAGEMENT_TOKEN & MOESIF_TEMPLATE_WORKSPACE_ID."
  );
}

if (!templateWorkspaceIdLiveEvent) {
  console.error(
    "No MOESIF_TEMPLATE_WORKSPACE_ID found. Please create an .env file with MOESIF_MANAGEMENT_TOKEN & MOESIF_TEMPLATE_WORKSPACE_ID."
  );
}

const provisioningService = getApimProvisioningPlugin();

const moesifMiddleware = moesif({
  applicationId: process.env.MOESIF_APPLICATION_ID,

  identifyUser: function (req, _res) {
    return req.user ? req.user.id : undefined;
  },
});

app.use(moesifMiddleware, cors());

app.post(
  "/create-stripe-checkout-session",
  authMiddleware,
  async (req, res) => {
    const stripe = StripeSDK(process.env.STRIPE_API_KEY);
    const priceId = req.query?.price_id;
    const email = req.user?.email || req.query?.email;
    // https://docs.stripe.com/checkout/quickstart?client=react
    // for embedded checkout.

    // make sure only one stripe customer per email
    let customerId = await getStripeCustomerId(email);

    if (!customerId) {
      // If no customerId exists, create a new one
      const customer = await stripe.customers.create({
        email: email,
      });

      customerId = customer.id;
    }

    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: priceId,
          },
        ],
        customer: customerId,
        mode: "subscription",
        return_url: `http://${process.env.FRONT_END_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}&price_id=${priceId}`,
      });

      console.log("got session back from stripe session");
      console.log(JSON.stringify(session));

      res.send({ clientSecret: session.client_secret });
    } catch (err) {
      console.error("Failed to create stripe checkout session", err);
      res.status(400).json({ message: "Error creating check out session" });
    }
  }
);

app.get("/plans", jsonParser, async (req, res) => {
  // if you created your "stripe" or "zoura" plans through moesif.
  // it is better
  getPlansFromMoesif()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error("Error getting plans from Moesif", err);
      res.status(500).json({ message: "Error getting plans from Moesif" });
    });
});

app.get("/subscriptions", authMiddleware, jsonParser, async (req, res) => {
  // But in this project, we get from Moesif, because
  // Moesif syncs subscriptions from several billing providers.
  // - from moesif, you can get a list of associated subscriptions
  //   using companyId, userId or email.
  // - Your use case needs and data model/mapping inform the best approach. (See DATA_MODEL.md)
  //   for assumptions in this project.
  // - In this project, since Stripe customer id is mapped to user_id in Moesif,
  //   We use that as the user_id to fetch subscriptions.

  const sanitizedEmail = req.query.email.replace(/\n|\r/g, "");
  console.log("query email " + sanitizedEmail);
  console.log("verified email from claims " + req.user.email);
  const email = req.user?.email || req.query.email;

  try {
    const stripeCustomerId = await getStripeCustomerId(email);
    // since customerId is mapped to moesif user_id (see DATA_MODEL.md);
    // please modify if you decides to use some other data mapping model.
    const subscriptions = await getSubscriptionsForUserId({
      userId: stripeCustomerId,
    });
    console.log(
      "got subscriptions from moesif " + JSON.stringify(subscriptions)
    );
    res.status(200).json(subscriptions);
  } catch (err) {
    console.error("Error getting subscription from moesif for " + email, err);
    res.status(404).json({ message: err.toString() });
  }
});

app.post("/okta/register", jsonParser, async (req, res) => {
  try {
    const oktaClient = new Client({
      orgUrl: process.env.OKTA_DOMAIN,
      token: process.env.OKTA_API_TOKEN,
    });

    const { firstName, lastName, email, password } = req.body;

    const newUser = {
      profile: {
        firstName,
        lastName,
        email,
        login: email,
      },
      credentials: {
        password: {
          value: password,
        },
      },
    };

    const response = await fetch(`${process.env.OKTA_DOMAIN}/api/v1/users`, {
      method: "POST",
      headers: {
        Authorization: `SSWS ${process.env.OKTA_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    const createdUser = await response.json();

    res
      .status(201)
      .json({ message: "User created successfully", user: createdUser });

    try {
      console.log(
        `URL = ${process.env.OKTA_DOMAIN}/api/v1/apps/${process.env.OKTA_APPLICATION_ID}/users/${createdUser.id}`
      );
      const assignUserResponse = await fetch(
        `${process.env.OKTA_DOMAIN}/api/v1/apps/${process.env.OKTA_APPLICATION_ID}/users/${createdUser.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `SSWS ${process.env.OKTA_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!assignUserResponse.ok) {
        throw new Error("Failed to assign user to application");
      }
      console.log("User assigned to application successfully.");
    } catch (error) {
      console.error("Failed to assign user to application:", error.message);
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// This handled after user success checked out from Moesif
// - handles syncing the ids to Moesif.
// - and creates customers to API Management platform if need.
// - Please see DATA-MODEL.md see the assumptions and background on data mapping.
app.post(
  "/register/stripe/:checkout_session_id",
  authMiddleware,
  function (req, res) {
    const checkout_session_id = req.params.checkout_session_id;

    verifyStripeSession(checkout_session_id)
      .then(async (result) => {
        const stripeCheckOutSessionInfo = result;
        console.log("in register");
        if (result.customer && result.subscription) {
          console.log("customer and subscription present");
          const email = result.customer_details.email;
          const stripe_customer_id = result.customer;
          const stripe_subscription_id = result.subscription;
          try {
            if (
              process.env.MOESIF_MONETIZATION_VERSION &&
              process.env.MOESIF_MONETIZATION_VERSION.toUpperCase() === "V1"
            ) {
              console.log("updating company and user with V1");
              // in v1, companyId and subscription id is one to one mapping.
              syncToMoesif({
                companyId: stripe_subscription_id,
                subscriptionId: stripe_subscription_id,
                userId: stripe_customer_id,
                email: email,
              });
            }
            // V2 as fallback
            else {
              console.log("updating company and user with V2");

              // assume you have one user per subscription
              // but if you have multiple users per each subscription
              // please check out https://www.moesif.com/docs/getting-started/overview/
              // for the different entities how they are related to each other.
              syncToMoesif({
                companyId: stripe_customer_id,
                subscriptionId: stripe_subscription_id,
                userId: stripe_customer_id,
                email: email,
              });
            }
          } catch (error) {
            console.error("Error updating user/company/sub:", error);
          }

          // Provision new user for access to API
          const user = await provisioningService.provisionUser(
            stripe_customer_id,
            email,
            stripe_subscription_id
          );
          console.log(JSON.stringify(user));
        }
        // we still pass on result.
        console.log(JSON.stringify(stripeCheckOutSessionInfo));
        res.status(201).json(stripeCheckOutSessionInfo);
      })
      .catch((err) => {
        console.error("Error registering user", err);
        res.status(500).json({
          message: "Failed to provision user. " + err.toString(),
        });
      });
  }
);

app.get("/stripe/customer", authMiddleware, function (req, res) {
  const email = req.user?.email || req.query.email;

  getStripeCustomer(email)
    .then((result) => {
      if (result.data && result.data[0]) {
        res.status(200).json(result.data[0]);
      } else {
        res.status(404).json("stripe customer not found");
      }
    })
    .catch((err) => {
      console.error("Error getting customer info from stripe", err);
      res.status(500).json({
        message: "Failed to retrieve customer info from stripe",
      });
    });
});

app.post("/create-key", authMiddleware, jsonParser, async function (req, res) {
  try {
    // if authentication used, email can come from idToken claims,
    // otherwise we use email from body.
    const email = req.user?.email || req.body.email;

    const customerId = await getStripeCustomerId(email);
    if (!customerId) {
      throw new Error(
        `Customer Id unknown. Ensure you're subscribed to a plan. If you just subscribed, try again.`
      );
    }

    // Provision new key for access to API
    const apiKey = await provisioningService.createApiKey(customerId, email);
    // Send the Tyk API key back as the response
    res.status(200).send({ apikey: apiKey });
  } catch (error) {
    console.error("Error creating key:", error);
    res.status(500).json({ message: "Failed to create key" });
  }
});

app.get(
  "/embed-charts(/:authUserId)",
  authMiddleware,
  async function (req, res) {
    // if authMiddleware is enabled, the data for user should come from the auth data.
    // otherwise use query param.
    const authUserId = req.user?.sub || req.params?.authUserId;
    const email = req.user?.email || req.query?.email;

    // depends your data model (see assumptions in DATA_MODEL.md),
    // and if in your API gateway if you identifyUser using stripeCustomerId
    // or the userId from authorization provider.
    // Perhaps, you have your own userId for your own system.
    // the most important aspect is the user_id used in your identifyUser hook
    try {
      const stripeCustomerId = await getStripeCustomerId(email);
      if (!stripeCustomerId) {
        console.error("stripe customer not found when fetching for " + email);
      }

      const embedInfoArray = await Promise.all(
        [templateWorkspaceIdTimeSeries, templateWorkspaceIdLiveEvent].map(
          (workspaceId) =>
            getInfoForEmbeddedWorkspaces({
              workspaceId: templateWorkspaceIdTimeSeries,
              userId: stripeCustomerId || authUserId,
            })
        )
      );
      res.status(200).json(embedInfoArray);
    } catch (err) {
      console.error("Error generating embedded templates:", error);
      res.status(500).json({ message: "Failed to retrieve embedded template" });
    }
  }
);

app.listen(port, () => {
  console.log(`My Dev Portal Backend is listening at http://localhost:${port}`);
});
