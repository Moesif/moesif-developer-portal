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
  createStripeCheckoutSession,
  updateStripeCustomerIdentity,
} = require("./services/stripeApis");
const {
  provisionSnApiCustomer,
  getSnApiPortalContext,
  listSnApiKeys,
  createSnApiKey,
  revokeSnApiKey,
  rotateSnApiKey,
} = require("./services/snApiProvisioning");
const {
  syncToMoesif,
  getInfoForEmbeddedWorkspaces,
  getPlansFromMoesif,
  getSubscriptionsForUserId,
  sendSubscriptionToMoesif,
} = require("./services/moesifApis");

const { authMiddleware } = require("./services/authPlugin");

const { getApimProvisioningPlugin } = require("./config/pluginLoader");
const {
  getUnifiedCustomerId,
  getUnifiedCustomerIdCached,
} = require("./services/commonUtils");
const { BillingProvider } = require("./services/billingProvider");

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

const customBillingProvider = new BillingProvider();

const moesifMiddleware = moesif({
  applicationId: process.env.MOESIF_APPLICATION_ID,

  identifyUser: function (req, _res) {
    return getUnifiedCustomerIdCached(req?.user);
  },
  identifyCompany: function (req, _res) {
    return req?.user?.moesif_company_id;
  },
});

app.use(moesifMiddleware, cors());

const PORTAL_CONTEXT_CACHE_TTL_MS = 5 * 60 * 1000;
const portalContextCache = new Map();

function applyPortalContext(req, context) {
  req.portalContext = context;
  req.user.moesif_user_id = context.moesif_user_id;
  req.user.moesif_company_id = context.moesif_company_id;
  req.user.sn_api_user_id = context.user_id;
  req.user.sn_api_organization_id = context.organization_id;
}

function invalidatePortalContext(auth0UserId) {
  if (auth0UserId) {
    portalContextCache.delete(auth0UserId);
  }
}

async function attachSnApiPortalContext(req, _res, next) {
  const auth0UserId = req.user?.sub;
  const cached = auth0UserId ? portalContextCache.get(auth0UserId) : undefined;

  if (cached && Date.now() - cached.fetchedAt < PORTAL_CONTEXT_CACHE_TTL_MS) {
    applyPortalContext(req, cached.context);
    return next();
  }

  try {
    const context = await getSnApiPortalContext(req.user);
    portalContextCache.set(auth0UserId, { context, fetchedAt: Date.now() });
    applyPortalContext(req, context);
  } catch (error) {
    if (error.status === 404) {
      // Authentication can happen before checkout has provisioned the
      // API account. Not cached so the context appears promptly once
      // provisioning completes.
      invalidatePortalContext(auth0UserId);
    } else {
      console.error("Failed to resolve SN API portal context:", error);
      if (cached) {
        // SN API is unavailable; serve the stale context rather than
        // emitting anonymous Moesif events.
        applyPortalContext(req, cached.context);
      }
    }
  }
  next();
}

const portalAuthMiddleware = [authMiddleware, attachSnApiPortalContext];

app.post(
  "/create-stripe-checkout-session",
  portalAuthMiddleware,
  async (req, res) => {
    const priceId = req.query?.price_id;
    const email = req.user?.email;
    const quantity = req.query?.quantity || undefined;

    console.log(`create-stripe-checkout-session called for ${email} priceId ${priceId} quantity ${quantity}`);

    if (!priceId) {
      return res.status(400).json({ message: "price_id is required" });
    }

    try {
      const session = await createStripeCheckoutSession(
        email,
        priceId,
        quantity,
        req?.user
      );
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

app.get("/subscriptions", portalAuthMiddleware, jsonParser, async (req, res) => {
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
  const email = req.user?.email;

  let moesifUserId;
  try {
    moesifUserId = await getUnifiedCustomerId(req.user, email);
    // see DATA_MODEL.md regarding how customer ids are mapped.
    // please modify if you decides to use some other data mapping model.
    if (!moesifUserId) {
      return res.status(200).json([]);
    }

    const subscriptions = await getSubscriptionsForUserId({
      userId: moesifUserId,
    });

    console.log(
      "got subscriptions from moesif " + JSON.stringify(subscriptions)
    );
    res.status(200).json(subscriptions);
  } catch (err) {
    console.error(
      "Error getting subscription from moesif for " +
        email +
        " " +
        moesifUserId,
      err
    );
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

// This handles Provision after user success checked out from Stripe
// - syncing the Stripe ids to Moesif.
// - creates customers to API Management platform if need.
// - Please see DATA-MODEL.md see the assumptions and background on data mapping.
app.post(
  "/register/stripe/:checkout_session_id",
  portalAuthMiddleware,
  function (req, res) {
    const checkout_session_id = req.params.checkout_session_id;

    verifyStripeSession(checkout_session_id)
      .then(async (result) => {
        const stripeCheckOutSessionInfo = result;
        console.log("in stripe register");
        if (result.status !== "complete") {
          return res.status(409).json({ message: "Stripe checkout is not complete" });
        }
        if (result.customer && result.subscription) {
          console.log("customer and subscription present");
          const email = result.customer_details?.email || result.customer.email;
          const price = result.line_items?.data?.[0]?.price;
          const provisionedCustomer = await provisionSnApiCustomer({
            authUser: req.user,
            customer: result.customer,
            subscription: result.subscription,
            price,
            product: price?.product,
          });
          console.log("provisioned SN API customer:", JSON.stringify({
            user_id: provisionedCustomer.user_id,
            organization_id: provisionedCustomer.organization_id,
            api_key_created: provisionedCustomer.api_key_created,
          }));
          req.user.moesif_user_id = String(provisionedCustomer.user_id);
          req.user.moesif_company_id = String(
            provisionedCustomer.moesif_company_id ||
              provisionedCustomer.organization_id
          );
          await updateStripeCustomerIdentity(result.customer.id, {
            moesifUserId: req.user.moesif_user_id,
            moesifCompanyId: req.user.moesif_company_id,
            auth0UserId: req.user.sub,
            subscriptionId: result.subscription.id,
          });
          syncToMoesif({
            companyId: req.user.moesif_company_id,
            userId: req.user.moesif_user_id,
            email,
            auth0UserId: req.user.sub,
            stripeCustomerId: provisionedCustomer.stripe_customer_id,
          });
          // Drop any pre-provisioning cache entry so the next request
          // fetches the full canonical context from the SN API.
          invalidatePortalContext(req.user.sub);
          stripeCheckOutSessionInfo.sn_api = {
            user_id: provisionedCustomer.user_id,
            organization_id: provisionedCustomer.organization_id,
            api_key_created: provisionedCustomer.api_key_created,
          };
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

// if you are using customer billing provider
// this should be triggered upon return from successful payment:
// - verify the purchase
// - create subscription object.
// - send the data to moesif.
// - provision the by calling API gateway plugin.
app.post(
  "/register/custom",
  portalAuthMiddleware,
  jsonParser,
  async function (req, res) {
    const customerId = await getUnifiedCustomerId(req.user);
    const email = req.user?.email;
    // verify plans and subscription using your custom billing provider.
    try {
      const { subscription } =
        await customBillingProvider.verifyPurchaseAndCreateSubscription(req, {
          user: req.user,
          ...req.body,
        });

      console.log("custom subscription created", subscription);

      syncToMoesif({
        companyId: customerId,
        userId: customerId,
        email: email,
      });

      sendSubscriptionToMoesif({
        companyId: customerId,
        subscriptionId: subscription.id,
        planId: subscription.plan_id,
        priceId: subscription.price_id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        metadata: {
          // additional metadata you might want add.
        },
      });

      const user = await provisioningService.provisionUser(
        customerId,
        email,
        subscription.id
      );
      res.status(201).json({ status: "provisioned" });
    } catch (err) {
      console.error("Error registering user", err);
      res.status(500).json({
        message: "Failed to provision user. " + err.toString(),
      });
    }
  }
);

app.get("/stripe/customer", portalAuthMiddleware, function (req, res) {
  const email = req.user?.email;

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

app.get("/portal-context", portalAuthMiddleware, function (req, res) {
  if (!req.portalContext) {
    return res.status(404).json({
      message: "Your API organization has not been provisioned yet.",
    });
  }
  return res.status(200).json(req.portalContext);
});

function sendKeyManagementError(res, error) {
  console.error("API key management error:", error);
  res.status(error.status || 500).json({
    message: error.message || "API key request failed",
  });
}

app.get("/api-keys", portalAuthMiddleware, async function (req, res) {
  try {
    res.status(200).json(await listSnApiKeys(req.user));
  } catch (error) {
    sendKeyManagementError(res, error);
  }
});

app.post("/api-keys", portalAuthMiddleware, jsonParser, async function (req, res) {
  try {
    res.status(201).json(
      await createSnApiKey(req.user, {
        name: req.body?.name,
        description: req.body?.description,
      })
    );
  } catch (error) {
    sendKeyManagementError(res, error);
  }
});

app.delete("/api-keys/:api_key_id", portalAuthMiddleware, async function (req, res) {
  try {
    await revokeSnApiKey(req.user, req.params.api_key_id);
    res.status(204).send();
  } catch (error) {
    sendKeyManagementError(res, error);
  }
});

app.post(
  "/api-keys/:api_key_id/rotate",
  portalAuthMiddleware,
  async function (req, res) {
    try {
      res.status(200).json(
        await rotateSnApiKey(req.user, req.params.api_key_id)
      );
    } catch (error) {
      sendKeyManagementError(res, error);
    }
  }
);

app.post("/create-key", portalAuthMiddleware, jsonParser, async function (req, res) {
  try {
    const apiKey = await createSnApiKey(req.user, {
      name: req.body?.name || "API key",
      description: req.body?.description,
    });
    res.status(200).send({ apikey: apiKey.api_key });
  } catch (error) {
    sendKeyManagementError(res, error);
  }
});

app.get(
  "/embed-charts(/:authUserId)",
  portalAuthMiddleware,
  async function (req, res) {
    // if authMiddleware is enabled, the data for user should come from the auth data.
    // otherwise use query param.
    const email = req.user?.email;

    // depends your data model (see assumptions in DATA_MODEL.md),
    // and if in your API gateway if you identifyUser using stripeCustomerId
    // or the userId from authorization provider.
    // Perhaps, you have your own userId for your own system.
    // the most important aspect is the user_id used in your identifyUser hook
    try {
      const companyId = req.user?.moesif_company_id;
      if (!companyId) {
        console.error("Canonical company ID not found when fetching for " + email);
        return res.status(400).json({
          message: "Your API organization has not been provisioned yet.",
        });
      }

      const embedInfoArray = await Promise.all(
        [templateWorkspaceIdLiveEvent, templateWorkspaceIdTimeSeries].map(
          (workspaceId) =>
            getInfoForEmbeddedWorkspaces({
              workspaceId: workspaceId,
              companyId,
            })
        )
      );
      res.status(200).json(embedInfoArray);
    } catch (err) {
      console.error("Error generating embedded templates:", err);
      res.status(500).json({ message: "Failed to retrieve embedded template" });
    }
  }
);

app.listen(port, () => {
  console.log(`My Dev Portal Backend is listening at http://localhost:${port}`);
});
