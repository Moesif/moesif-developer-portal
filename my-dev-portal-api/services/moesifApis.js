const moesif = require("moesif-nodejs");

const moesifManagementToken = process.env.MOESIF_MANAGEMENT_TOKEN;
const moesifApiEndPoint = "https://api.moesif.com";

const moesifMiddleware = moesif({
  applicationId: process.env.MOESIF_APPLICATION_ID,

  identifyUser: function (req, _res) {
    return req.user ? req.user.id : undefined;
  },
});

function syncToMoesif({ companyId, userId, email, subscriptionId }) {
  if (companyId) {
    var company = {
      companyId: companyId,
      metadata: {
        // feel free to add additonal profile data here.
      },
    };
    moesifMiddleware.updateCompany(company);
  }
  if (userId) {
    var user = {
      userId: userId,
      companyId: companyId,
      metadata: {
        // feel free to add additional profile data here.
        email: email,
      },
    };
    moesifMiddleware.updateUser(user);
  }

  if (subscriptionId) {
    var subscription = {
      subscriptionId,
      companyId: companyId,
      status: "active",
    };
    moesifMiddleware
      .updateSubscription(subscription)
      .then((result) => {
        console.log("subscription updated successfully");
      })
      .catch((err) => {
        console.error("Error updating subscription", err);
      });
  }
}

function getPlansFromMoesif() {
  return fetch(
    `https://api.moesif.com/v1/~/billing/catalog/plans?includes=prices&provider=${process.env.APP_PAYMENT_PROVIDER}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MOESIF_MANAGEMENT_TOKEN}`,
      },
    }
  ).then(res => res.json());
}


function getSubscriptionsForCompanyId({ companyId }) {


}

function getSubscriptionsForUserId({ userId }) {

}

function getSubscriptionForUser({ email }) {

}

function getInfoForEmbeddedWorkspaces({ userId, workspaceId }) {
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

  const moesif_url_live_event = `${moesifApiEndPoint}/v1/portal/~/workspaces/${workspaceId}/access_token?expiration=${expiration}`;

  return fetch(moesif_url_live_event, {
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
    });
}



module.exports = {
  syncToMoesif,
  getPlansFromMoesif,
  getInfoForEmbeddedWorkspaces,
  getSubscriptionsForCompanyId,
  getSubscriptionsForUserId,
};
