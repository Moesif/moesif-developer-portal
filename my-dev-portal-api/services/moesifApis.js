const moesif = require("moesif-nodejs");

const moesifMiddleware = moesif({
  applicationId: process.env.MOESIF_APPLICATION_ID,

  identifyUser: function (req, _res) {
    return req.user ? req.user.id : undefined;
  },
});

export function syncToMoesif({}) {
  moesifMiddleware.updateCompany(company);
}
