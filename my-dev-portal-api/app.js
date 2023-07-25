const express = require("express");
const path = require("path");
require("dotenv").config();
var bodyParser = require("body-parser");
const moesif = require("moesif-nodejs");
const Stripe = require("stripe");
var cors = require("cors");
const fetch = require("node-fetch");
const { Client } = require("@okta/okta-sdk-nodejs");
const { ManagementClient } = require('auth0');

const app = express();
app.use(express.static(path.join(__dirname)));
const port = 3030;
const apimProvider = process.env.APIM_PROVIDER;

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

app.post("/register", jsonParser, async (req, res) => {
  try {
    const email = req.body.email;
    const stripe_customer_id = req.body.customer_id;
    const stripe_subscription_id = req.body.subscription_id;

    var company = { companyId: stripe_subscription_id };
    moesifMiddleware.updateCompany(company);

    var user = {
      userId: stripe_customer_id,
      companyId: stripe_subscription_id,
      metadata: {
        email: email,
      },
    };
    moesifMiddleware.updateUser(user);

    if(apimProvider === "Kong") {

      var body = { username: req.body.email, custom_id: stripe_customer_id };
      await fetch(`${process.env.KONG_URL}/consumers/`, {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
    } else if(apimProvider === "AWS") {
      const auth0 = new ManagementClient({
        token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IklRYlRDY2xHeGU5LUhLUDROUVc2cyJ9.eyJpc3MiOiJodHRwczovL2Rldi16b2psZXBlZWR5ZWxldW4zLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhd05zcnRXelVCRHpQenNQOEw2TkhybWNNNldoNXBQVUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtem9qbGVwZWVkeWVsZXVuMy51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTY5MDMxNjM0OCwiZXhwIjoxNjkwNDAyNzQ4LCJhenAiOiJhd05zcnRXelVCRHpQenNQOEw2TkhybWNNNldoNXBQVSIsInNjb3BlIjoicmVhZDpjbGllbnRfZ3JhbnRzIGNyZWF0ZTpjbGllbnRfZ3JhbnRzIGRlbGV0ZTpjbGllbnRfZ3JhbnRzIHVwZGF0ZTpjbGllbnRfZ3JhbnRzIHJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGRlbGV0ZTp1c2VycyBjcmVhdGU6dXNlcnMgcmVhZDp1c2Vyc19hcHBfbWV0YWRhdGEgdXBkYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBkZWxldGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgcmVhZDp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBkZWxldGU6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDpob29rcyB1cGRhdGU6aG9va3MgZGVsZXRlOmhvb2tzIGNyZWF0ZTpob29rcyByZWFkOmFjdGlvbnMgdXBkYXRlOmFjdGlvbnMgZGVsZXRlOmFjdGlvbnMgY3JlYXRlOmFjdGlvbnMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDppbnNpZ2h0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMgcmVhZDplbnRpdGxlbWVudHMgcmVhZDphdHRhY2tfcHJvdGVjdGlvbiB1cGRhdGU6YXR0YWNrX3Byb3RlY3Rpb24gcmVhZDpvcmdhbml6YXRpb25zIHVwZGF0ZTpvcmdhbml6YXRpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVycyByZWFkOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGRlbGV0ZTpvcmdhbml6YXRpb25fbWVtYmVycyBjcmVhdGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIHVwZGF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyByZWFkOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgY3JlYXRlOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyByZWFkOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uc19zdW1tYXJ5IGNyZWF0ZTphY3Rpb25zX2xvZ19zZXNzaW9ucyBjcmVhdGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyByZWFkOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgdXBkYXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgZGVsZXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgcmVhZDpjbGllbnRfY3JlZGVudGlhbHMgY3JlYXRlOmNsaWVudF9jcmVkZW50aWFscyB1cGRhdGU6Y2xpZW50X2NyZWRlbnRpYWxzIGRlbGV0ZTpjbGllbnRfY3JlZGVudGlhbHMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.jbjqG9K30nsw9q0YeUmNuRaTSPBbYNcuWPnnKw6PRdW8wy-7DLdaE_5HS-G_sukXEs9jufPRDdkokYIhCbNCbnVFXoUI6AjLfIqbqzME7GihTjgXKq_8F361186sdnSmOtfJ0dmXOjwlQevBQLpJlqIpjMl1B4thP-_6QVs4CrIcgtmLn4NiZrFOAulVkIuxapaBgI_TAI_kQ3WWnob5qnCs1bsMiTzsupLdaLoZrbb_gVr2iSBd4x0MH3Eg4itMsjVIPn8wZFRUAd3DtJKywR9t6vzLyvZNMVklVax0m1ndJBNizuCJMqjjLBC_zb9XYNFlDJM0oMKD4zDHppL8sA',
        domain: 'dev-zojlepeedyeleun3.us.auth0.com',
      });
    
      // Find the user in Auth0 by their email
      const users = await auth0.getUsersByEmail(email);
      const user = users[0];
    
      // Update the user's app_metadata with the stripe customer ID
      await auth0.updateUser({
        id: user.user_id}, {
        app_metadata: { 
          stripeCustomerId: stripe_customer_id,
          stripeSubscriptionId: stripe_subscription_id
        }
      });
    }
    res.status(200);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
});

app.post("/create-key", jsonParser, async function (req, res) {
  try {
    const email = req.body.email;
    var apiKey = "";

    if (apimProvider === "Kong") {
      const response = await fetch(
        `${process.env.KONG_URL}/consumers/${encodeURIComponent(email)}/key-auth`,
        {
          method: "post",
        }
      );
      var data = await response.json();
      apiKey = data.key;
      res.status(200);
      res.send({ apikey: apiKey });
    } else if (apimProvider === "AWS") {

      var auth0Jwt = req.headers.authorization; // Get the Auth0 JWT from the request

      if (!auth0Jwt) {
          throw new Error('No authorization header provided');
      }
      
      if (!auth0Jwt.startsWith('Bearer ')) {
          throw new Error('Invalid authorization header');
      }
      
      auth0Jwt = auth0Jwt.slice(7);
      res.status(200).send({ apikey: auth0Jwt });
    
    }
  } catch (error) {
    console.error("Error creating key:", error);
    res.status(500).json({ message: "Failed to create key" });
  }
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
  try {
    const userId = req.params.userId;
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
    tomorrow.setDate(tomorrow.getDate() + 7);
    const expiration = tomorrow.toISOString();

    const moesif_url_time_series = `${moesifApiEndPoint}/v1/portal/~/workspaces/${templateWorkspaceIdTimeSeries}/access_token?expiration=${expiration}`;

    fetch(moesif_url_time_series, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${moesifManagementToken}`,
      },
      body: JSON.stringify(templateData),
    })
      .then((response) => {
        if (response.ok) {
          return response;
        } else {
          console.log("Api call to moesif not successful. server response is:");
          console.error(response.statusText);
          throw Error(response.statusText);
        }
      })
      .then((response) => {
        return response.json();
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
    tomorrow.setDate(tomorrow.getDate() + 7);
    const expiration = tomorrow.toISOString();

    const moesif_url_live_event = `${moesifApiEndPoint}/v1/portal/~/workspaces/${templateWorkspaceIdLiveEvent}/access_token?expiration=${expiration}`;

    fetch(moesif_url_live_event, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${moesifManagementToken}`,
      },
      body: JSON.stringify(templateData),
    })
      .then((response) => {
        if (response.ok) {
          return response;
        } else {
          console.log("Api call to moesif not successful. server response is:");
          console.error(response.statusText);
          throw Error(response.statusText);
        }
      })
      .then((response) => {
        return response.json();
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
