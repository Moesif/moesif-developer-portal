const express = require("express");
const path = require("path");
require("dotenv").config();
var bodyParser = require("body-parser");
const moesif = require("moesif-nodejs");
const Stripe = require("stripe");
var cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(express.static(path.join(__dirname)));
const port = 3030;

const moesifManagementToken = process.env.MOESIF_MANAGEMENT_TOKEN;
const templateWorkspaceIdLiveEvent =
  process.env.MOESIF_TEMPLATE_WORKSPACE_ID_LIVE_EVENT_LOG;
const templateWorkspaceIdTimeSeries =
  process.env.MOESIF_TEMPLATE_WORKSPACE_ID_TIME_SERIES;
const moesifApiEndPoint = "https://api.moesif.com";

const stripe = Stripe(process.env.STRIPE_KEY);
var jsonParser = bodyParser.json();

const moesifMiddleware = moesif({
  applicationId: process.env.MOESIF_APPLICATION_ID,

  identifyUser: function (req, _res) {
    return req.user ? req.user.id : undefined;
  },

  identifyCompany: function (req, res) {
    // your code here, must return a string
    return req.headers["X-Organization-Id"];
  },
});

app.use(moesifMiddleware, cors());

app.post("/register", jsonParser, async (req, res) => {
  console.log(req);

  const email = req.body.email;
  const stripe_customer_id = req.body.customer_id;
  const stripe_subscription_id = req.body.subscription_id;

  // create user and company in Moesif
  var company = { companyId: stripe_subscription_id };
  moesifMiddleware.updateCompany(company);
  console.log("Moesif create company");

  var user = {
    userId: stripe_customer_id,
    companyId: stripe_subscription_id,
    metadata: {
      email: email,
    },
  };
  moesifMiddleware.updateUser(user);
  console.log("Moesif create user");

  var body = { username: req.body.email, custom_id: stripe_customer_id };
  console.log(body);
  
  await fetch(`${process.env.KONG_URL}/consumers/`, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  res.status(200);
});

app.post("/create-key", jsonParser, async function (req, res) {
  console.log("Kong create consumer");
  console.log(data);
  // send back a new API key for use
  var response = await fetch(
    `${process.env.KONG_URL}/consumers/${req.body.email}/key-auth`,
    {
      method: "post",
    }
  );
  console.log(response);
  var data = await response.json();
  console.log("Kong create API key");
  console.log(data);
  var kongAPIKey = data.key;

  res.status(200);
  res.send({ apikey: kongAPIKey });
});

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

app.get("/embed-dash-time-series(/:userId)", function (req, res) {
  const userId = req.params.userId;
  console.log(userId);
  const templateData = {
    template: {
      values: {
        user_id: userId,
      },
    },
  };

  // Set your desired expiration for the generated workspace token.
  // Moesif's recommendation is to match or be larger than your user's session time while keeping time period less than 30 days.
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const expiration = tomorrow.toISOString();

  const moesif_url_time_series = `${moesifApiEndPoint}/v1/portal/~/workspaces/${templateWorkspaceIdTimeSeries}/access_token?expiration=${expiration}`;

  fetch(moesif_url_time_series, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${moesifManagementToken}`,
    },
    body: JSON.stringify(templateData),
  })
    .then((response) => {
      if (response.ok) {
        console.log(response);
        return response;
      } else {
        console.log("Api call to moesif not successful. server response is:");
        console.error(response.statusText);
        throw Error(response.statusText);
      }
    })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((info) => {
      console.log(info);
      res.json(info);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        error: "something went wrong",
      });
    });
});

app.get("/embed-dash-live-event(/:userId)", function (req, res) {
  const userId = req.params.userId;
  console.log(userId);
  const templateData = {
    template: {
      values: {
        user_id: userId,
      },
    },
  };

  const moesif_url_live_event = `${moesifApiEndPoint}/v1/portal/~/workspaces/${templateWorkspaceIdLiveEvent}/access_token?expiration=${expiration}`;

  fetch(moesif_url_live_event, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${moesifManagementToken}`,
    },
    body: JSON.stringify(templateData),
  })
    .then((response) => {
      if (response.ok) {
        console.log(response);
        return response;
      } else {
        console.log("Api call to moesif not successful. server response is:");
        console.error(response.statusText);
        throw Error(response.statusText);
      }
    })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((info) => {
      console.log(info);
      res.json(info);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        error: "something went wrong",
      });
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
