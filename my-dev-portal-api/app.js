const express = require("express");
const path = require("path");
require("dotenv").config();
var bodyParser = require("body-parser");
const moesif = require("moesif-nodejs");
var cors = require("cors");
const fetch = require("node-fetch");
const { Client } = require("@okta/okta-sdk-nodejs");

const {
  verifyStripeSession,
  getStripeCustomer,
} = require("./services/stripeApis");
const {
  syncToMoesif,
  getInfoForEmbeddedWorkspaces,
  getPlansFromMoesif,
  getSubscriptionForUserEmail,
} = require("./services/moesifApis");

const {
  updateAuth0UserAppWithStripeInfo
} = require('./services/auth0Services');

const StripeSDK = require("stripe");
const {
  createKongConnectCustomer,
  createKongEnterpriseCustomer,
  createKonnectApiKeyForCustomer,
} = require("./services/kongAPIMServices");

const app = express();
app.use(express.static(path.join(__dirname)));
const port = 3030;
const apimProvider = process.env.APIM_PROVIDER;

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

if (!apimProvider) {
  console.error(
    "No APIM_PROVIDER found. Please create an .env file with APIM_PROVIDER one of the supported API management providers or edit the code to connect to your API Management."
  );
}

const moesifMiddleware = moesif({
  applicationId: process.env.MOESIF_APPLICATION_ID,

  identifyUser: function (req, _res) {
    return req.user ? req.user.id : undefined;
  },
});

app.use(moesifMiddleware, cors());

app.post("/create-stripe-checkout-session", async (req, res) => {
  const stripe = StripeSDK(process.env.STRIPE_API_KEY);
  const priceId = req.query?.price_id;
  const email = req.query?.email;
  // https://docs.stripe.com/checkout/quickstart?client=react
  // for embedded checkout.

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: priceId,
        },
      ],
      customer_email: email || undefined,
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
});

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

app.get("/subscriptions", jsonParser, async (req, res) => {
  // !IMPORTANT, depends on your authentication scheme
  // you may want to authenticate your user first

  // - you can get subscription from moesif or stripe
  // since they are synced. But in this example, we get from Moesif, because
  // Moesif syncs subscriptions from several billing providers.
  // - from moesif, you can get a list of associated subscriptions
  //   using companyId, userId or email as in this example
  // - It all can vary depends on your profile.

  const email = req.query.email;

  try {
    const subscriptions = await getSubscriptionForUserEmail({ email });
    console.log(
      "got subscriptions from moesif " + JSON.stringify(subscriptions)
    );
    res.status(200).json(subscriptions);
  } catch (err) {
    console.error("Error getting subscription from moesif for " + email, err);
    res.status(404).json({ message: "Error" });
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
app.post("/register/stripe/:checkout_session_id", function (req, res) {
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
          // V1 as fallback
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

        if (apimProvider === "Kong") {
          // Konnect
          if (
            typeof process.env.KONNECT_PAT !== "undefined" &&
            process.env.KONNECT_PAT !== ""
          ) {
            const kongConsumerResponse = await createKongConnectCustomer({
              username: email,
              customId: stripe_customer_id,
            });
          } else {
            // Kong Enterprise
            const KongConsumerResponse = await createKongEnterpriseCustomer({
              username: email,
              customId: stripe_customer_id,
            });
          }
        } else if (apimProvider === "AWS") {
          // for AWS, we are using the appMeta info
          // in Auth0 determine service level.
          // which will update the credentials
          updateAuth0UserAppWithStripeInfo({
            email,
            stripe_customer_id,
            stripe_subscription_id,
          });
        }
      }
      // we still pass on result.
      console.log(JSON.stringify(stripeCheckOutSessionInfo));
      res.status(201).json(stripeCheckOutSessionInfo);
    })
    .catch((err) => {
      console.error("Error registering user", err);
      res.status(500).json({
        message: "Failed to register user. Contact support for assistance",
      });
    });
});

app.get("/stripe/customer", function (req, res) {
  const email = req.query.email;
  console.log("get stripe customer " + typeof getStripeCustomer);
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

app.post("/create-key", jsonParser, async function (req, res) {
  try {
    const email = req.body.email;
    const kongConsumerId = req.body.kongConsumerId;
    var apiKey = "";

    if (apimProvider === "Kong") {
      // Konnect
      if (
        typeof process.env.KONNECT_PAT !== "undefined" &&
        process.env.KONNECT_PAT !== ""
      ) {

        const konnectKeyResult = await createKonnectApiKeyForCustomer({ email });
        console.log(`Created Konnect Consumer Key`);
        apiKey = konnectKeyResult.key;
        res.status(200);
        res.send({ apikey: apiKey });
      } else {
        // Kong Enterprise
        const data = await createKongEnterpriseApiKeyCustomer({ email })
        apiKey = data.key;
        res.status(200);
        res.send({ apikey: apiKey });
      }
    } else if (apimProvider === "AWS") {
      var auth0Jwt = req.headers.authorization; // Get the Auth0 JWT from the request

      if (!auth0Jwt) {
        throw new Error("No authorization header provided");
      }

      if (!auth0Jwt.startsWith("Bearer ")) {
        throw new Error("Invalid authorization header");
      }

      auth0Jwt = auth0Jwt.slice(7);
      res.status(200).send({ apikey: auth0Jwt });
    } else if (apimProvider === "Tyk") {
      var stripe_customer_id = "";

      // Fetch the customer info from Stripe
      const stripeResponse = await fetch(
        `https://api.stripe.com/v1/customers/search?query=${encodeURIComponent(
          `email:"${email}"`
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.STRIPE_API_KEY}`,
          },
        }
      );

      if (stripeResponse.ok) {
        const result = await stripeResponse.json();

        if (result.data && result.data[0]) {
          stripe_customer_id = result.data[0].id;
        } else {
          // Stripe customer not found
          throw new Error("(Tyk) Stripe customer not found");
        }
      } else {
        // Handle non-2xx HTTP response from Stripe
        throw new Error(
          `(Tyk) Stripe API returned status: ${stripeResponse.status}`
        );
      }

      // Create the request body for Tyk API
      var body = {
        alias: stripe_customer_id,
        org_id: `${process.env.TYK_DASH_ORG_ID}`,
      };

      // Send the request to Tyk API
      var response = await fetch(`${process.env.TYK_GATEWAY_URL}/tyk/keys`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "x-tyk-authorization": `${process.env.TYK_GATEWAY_SECRET_KEY}`,
        },
      });

      if (!response.ok) {
        // Handle non-2xx HTTP response from Tyk
        throw new Error(`(Tyk) Tyk API returned status: ${response.status}`);
      }

      var data = await response.json();
      var tykAPIKey = data.key;

      // Send the Tyk API key back as the response
      res.status(200).send({ apikey: tykAPIKey });
    }
  } catch (error) {
    console.error("Error creating key:", error);
    res.status(500).json({ message: "Failed to create key" });
  }
});

app.get("/embed-dash-time-series(/:userId)", function (req, res) {
  try {
    const userId = req.params.userId;

    getInfoForEmbeddedWorkspaces({
      workspaceId: templateWorkspaceIdTimeSeries,
      userId,
    })
      .then((info) => {
        res.json(info);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          error: "something went wrong",
        });
      });
  } catch (error) {
    console.error("Error generating embedded template:", error);
    res.status(500).json({ message: "Failed to retrieve embedded template" });
  }
});

app.get("/embed-dash-live-event(/:userId)", function (req, res) {
  try {
    const userId = req.params.userId;
    getInfoForEmbeddedWorkspaces({
      workspaceId: templateWorkspaceIdLiveEvent,
      userId,
    })
      .then((info) => {
        res.json(info);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          error: "something went wrong",
        });
      });
  } catch (error) {
    console.error("Error generating embedded template:", error);
    res.status(500).json({ message: "Failed to retrieve embedded template" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
