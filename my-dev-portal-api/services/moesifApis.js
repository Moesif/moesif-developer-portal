const moesif = require("moesif-nodejs");

const moesifMiddleware = moesif({
  applicationId: process.env.MOESIF_APPLICATION_ID,

  identifyUser: function (req, _res) {
    return req.user ? req.user.id : undefined;
  },
});

function syncToMoesif({ companyId, userId, email, subscriptionId }) {
  if (companyId) {
    var company = { companyId: companyId };
    moesifMiddleware.updateCompany(company);
  }
  if (userId) {
    var user = {
      userId: userId,
      companyId: companyId,
      metadata: {
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

module.exports = {
  syncToMoesif,
};
