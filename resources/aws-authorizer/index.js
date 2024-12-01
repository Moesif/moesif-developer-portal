require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err); // Pass the error to the callback function.
      return; // Immediately return to prevent further execution.
    }

    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

exports.handler = function (event, _context, callback) {
  const token = event.authorizationToken;

  console.log(token);

  jwt.verify(
    token,
    getKey,
    {
      algorithms: ["RS256"],
    },
    function (err, decoded) {
      if (err) {
        callback("Unauthorized");
        console.log("Unauthorized");
      } else {
        callback(
          null,
          generatePolicy(decoded.org_id, "Allow", event.methodArn)
        );
      }
    }
  );
};

function generatePolicy(principalId, effect, resource) {
  var authResponse = {};
  console.log(principalId);

  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
}
