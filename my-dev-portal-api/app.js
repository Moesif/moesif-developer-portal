const express = require("express");
const path = require("path");
require("dotenv").config();
var bodyParser = require("body-parser");
const moesif = require("moesif-nodejs");
var cors = require("cors");
const fetch = require("node-fetch");
const { Client } = require("@okta/okta-sdk-nodejs");
const { ManagementClient } = require("auth0");
const {
  verifyStripeSession,
  getStripeCustomer,
} = require("./services/stripeApis");
const {
  syncToMoesif,
  getInfoForEmbeddedWorkspaces,
  getPlansFromMoesif,
} = require("./services/moesifApis");

const StripeSDK = require('stripe');

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

if (apimProvider) {
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


app.post('/create-stripe-checkout-session', async (req, res) => {

  const stripe = StripeSDK(process.env.STRIPE_API_KEY);
  const priceId = req.query?.price_id;

  // https://docs.stripe.com/checkout/quickstart?client=react

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONT_END_DOMAIN}/return?success=true`,
    cancel_url: `${process.env.FRONT_END_DOMAIN}/return?canceled=true`,
  });

  res.redirect(303, session.url);
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

app.post("/register/stripe/:checkout_session_id", function (req, res) {
  const checkout_session_id = req.params.checkout_session_id;

  verifyStripeSession(checkout_session_id)
    .then(async (result) => {
      console.log("in register");
      if (result.customer && result.subscription) {
        console.log("customer and subscription present");
        const email = result.customer_details.email;
        const stripe_customer_id = result.customer;
        const stripe_subscription_id = result.subscription;
        try {
          if (
            process.env.MOESIF_MONETIZATION_VERSION &&
            process.env.MOESIF_MONETIZATION_VERSION.toUpperCase() === "V2"
          ) {
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
          // V1 as fallback
          else {
            // in v1, companyId and subscription id is one to one mapping.
            syncToMoesif({
              companyId: stripe_subscription_id,
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
            console.log("Kong Konnect, collecting runtime group ID");
            const konnectURL = `${process.env.KONNECT_API_URL}/${process.env.KONNECT_API_VERSION}`;
            // get Konnect Runtime Group ID
            console.log("Kong Konnect, collecting runtime group ID");
            const rtgResponse = await fetch(
              `${konnectURL}/runtime-groups?filter[name][eq]=${process.env.KONNECT_RUNTIME_GROUP_NAME}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${process.env.KONNECT_PAT}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            );

            if (!rtgResponse.ok) {
              console.log(
                `Failed GET Konnect API for runtime group: ${rtgResponse.status}, ${rtgResponse.statusText}`
              );
              console.log(
                `${konnectURL}/runtime-groups?filter[name][eq]=${process.env.KONNECT_RUNTIME_GROUP_NAME}`
              );
              throw new Error("Failed GET Konnect API for runtime group");
            }

            const rtgResult = await rtgResponse.json();

            console.log(
              `Got Konnect runtime group ID: ${rtgResult.data[0].id}`
            );
            const konnectRtgId = rtgResult.data[0].id;

            // create Konnect Consumer
            var kongConsumer = {
              username: email,
              custom_id: stripe_customer_id,
            };

            console.log("Kong Konnect, ensuring a consumer exists");
            const consumerResponse = await fetch(
              `${konnectURL}/runtime-groups/${konnectRtgId}/core-entities/consumers/`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${process.env.KONNECT_PAT}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify(kongConsumer),
              }
            );
          } else {
            // Kong Enterprise
            var body = { username: email, custom_id: stripe_customer_id };
            await fetch(`${process.env.KONG_URL}/consumers/`, {
              method: "POST",
              body: JSON.stringify(body),
              headers: { "Content-Type": "application/json" },
            });
          }
        } else if (apimProvider === "AWS") {
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

          fetch(url, options)
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
      }
      // we still pass on result.
      console.log(JSON.stringify(result));
      res.status(201).json(result);
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
        console.log("Kong Konnect, collecting runtime group ID");
        const konnectURL = `${process.env.KONNECT_API_URL}/${process.env.KONNECT_API_VERSION}`;
        // get Konnect Runtime Group ID
        console.log("Kong Konnect, collecting runtime group ID");
        const rtgResponse = await fetch(
          `${konnectURL}/runtime-groups?filter[name][eq]=${process.env.KONNECT_RUNTIME_GROUP_NAME}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.KONNECT_PAT}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!rtgResponse.ok) {
          throw new Error("Failed GET Konnect API for runtime group");
        }

        const rtgResult = await rtgResponse.json();

        console.log(`Got Konnect runtime group ID: ${rtgResult.data[0].id}`);
        const konnectRtgId = rtgResult.data[0].id;

        //get kong consumer
        const consumerResponse = await fetch(
          `${konnectURL}/runtime-groups/${konnectRtgId}/core-entities/consumers/${encodeURIComponent(
            email
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.KONNECT_PAT}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!consumerResponse.ok) {
          console.log(
            `Failed GET Konnect consumer : ${consumerResponse.status}, ${consumerResponse.statusText}`
          );
          throw new Error("Failed GET Konnect API for runtime group");
        }

        const consumerResult = await consumerResponse.json();

        // create Konnect Consumer Key-Auth
        const konnectKeyResponse = await fetch(
          `${konnectURL}/runtime-groups/${konnectRtgId}/core-entities/consumers/${consumerResult.id}/key-auth`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.KONNECT_PAT}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!konnectKeyResponse.ok) {
          console.log(
            `${konnectURL}/runtime-groups/${konnectRtgId}/core-entities/consumers/${consumerResult.id}/key-auth`
          );
          console.log(
            `Failed POST Konnect API for key-auth: ${konnectKeyResponse.status}, ${konnectKeyResponse.statusText}`
          );
          throw new Error("Failed POST Konnect API for key-auth");
        }
        const konnectKeyResult = await konnectKeyResponse.json();
        console.log(`Created Konnect Consumer Key`);
        apiKey = konnectKeyResult.key;
        res.status(200);
        res.send({ apikey: apiKey });
      } else {
        // Kong Enterprise
        //TODO: Add admin api token for Kong Enterprise
        console.log(
          `${process.env.KONG_URL}/consumers/${encodeURIComponent(
            email
          )}/key-auth`
        );
        const response = await fetch(
          `${process.env.KONG_URL}/consumers/${encodeURIComponent(
            email
          )}/key-auth`,
          {
            method: "POST",
          }
        );
        var data = await response.json();
        console.log(data);
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
