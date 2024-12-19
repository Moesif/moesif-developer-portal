require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: `https://${process.env.JWKS_URI}`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err); // Pass the error to the callback function.
      return; // Immediately return to prevent further execution.
    }

    var signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

exports.handler = function (event, _context, callback) {
  const token = event.authorizationToken;
  // This environment variable holds the secret to verify the JWT with.
  //
  // For HS256-signed JWTS, this variable is the same secret the JWT is signed with 
  // and must equal the `PLUGIN_JWT_SECRET` environment variable in 
  // my-dev-portal-api/.env.
  // 
  // For RS256-signed JWTs, it holds the public key to verify the JWT with to make 
  // testing easier by not having to set up a JWKS URI.
  const secret = process.env.JWT_VERIFY_KEY ?? getKey;

  console.log(token);

  jwt.verify(
    token,
    secret,
    {
      algorithms: ["RS256", "HS256"],
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
