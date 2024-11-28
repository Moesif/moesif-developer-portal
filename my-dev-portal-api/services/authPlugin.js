const { OktaJwtVerifier } = require("@okta/jwt-verifier");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const oktaJwtVerifier =
  process.env.AUTH_PROVIDER === "Okta"
    ? new OktaJwtVerifier({
        issuer: process.env.OKTA_DOMAIN,
        clientId: process.env.OKTA_APPLICATION_ID,
      })
    : null;

const verifyIdTokenIdOkta = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const { claims } = await oktaJwtVerifier.verifyAccessToken(token);

    req.user = claims;

    // the sub is usually the user id in tokens.
    req.user.id = claims.id || claims.sub;
    next();
  } catch (err) {
    return res.status(403).json({
      error: "invalid_token",
      message: err.message,
    });
  }
};

const verifyAccessTokenOkta = async (req, res, next) => {
  const accessToken = req.headers.authorization;

  try {
    const response = await fetch(
      `${process.env.OKTA_DOMAIN}/oauth2/default/introspect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${process.env.OKTA_API_TOKEN}`,
        },
        body: `token=${accessToken}`,
      }
    );

    const tokenInfo = await response.json();

    if (tokenInfo.active) {
      req.user = tokenInfo;
      next();
    } else {
      return res.status(403).json({
        error: "invalid_token",
        message: "The access token is invalid or expired",
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: "internal_server_error",
      message: err.message,
    });
  }
};

const verifyTokenAuth0 = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(idToken, process.env.AUTH0_CLIENT_SECRET);
    req.user = decoded;
    // the sub is usually the user id in tokens.
    req.user.id = decoded.id || decoded.sub;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid ID token" });
  }
};

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`, // URL to fetch signing keys
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('error get public key to verify jwt', err);
      return callback(err);
    }
    console.error('no error get key', key);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

const verifyTokenAuth02 = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  jwt.verify(
    token,
    getKey,
    {
      audience: process.env.AUTH0_CLIENT_ID,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ["RS256"]
    },
    (err, decoded) => {
      if (err) {
        console.error('error from jwt verify', err);
        return res.status(401).json({ message: "Invalid token", error: err });
      }
      req.user = decoded; // Attach decoded payload to the request object
      next();
    }
  );
};

const skipAuthCheck = (req, res, next) => {
  req.user = {};
  next();
};

function getFinalChecker() {
  switch (process.env.AUTH_PROVIDER) {
    case "Auth0":
      return verifyTokenAuth02;
    case "Okta":
      return verifyIdTokenIdOkta;
    default:
      return skipAuthCheck;
  }
}

module.exports = {
  verifyIdTokenIdOkta,
  verifyAccessTokenOkta,
  verifyTokenAuth0,
  skipAuthCheck,
  authMiddleware: getFinalChecker(),
};
