const { ProvisioningPlugin } = require("../provisioningPlugin");
const jwt = require("jsonwebtoken");

class JwtProvisioningPlugin extends ProvisioningPlugin {
    constructor() {
        super();
        this.slug = "jwt";
        this.jwtAlgorithm = process.env.JWT_ALGORITHM;
        this.jwtSecret = process.env.JWT_SECRET.trim();
        this.jwtUserIdField = process.env.JWT_USER_ID_FIELD;
        this.jwtCompanyIdField = process.env.JWT_COMPANY_ID_FIELD;
        this.jwtExpiresIn = +process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRES_IN;
    }

    async getUser(customerId, email) {
        return {}
    }

    async provisionUser(customerId, email, subscriptionId) {
      // Nothing to do
      return
    }

    async createApiKey(customerId, email) {    
      // Define the payload with claims
      const payload = {
        [this.jwtUserIdField]: customerId,
        [this.jwtCompanyIdField]: customerId,
      };

      // Sign the token
      const token = jwt.sign(payload, this.jwtSecret, { 
        algorithm: this.jwtAlgorithm,
        expiresIn: this.jwtExpiresIn
      });

      console.log(`Generated new JWT with claims ${JSON.stringify(this.jwtExpiresIn)}`)
      return token;
    }

    normalizeUser(user) {
        // Normalize the user object as needed
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            billing_customer_id: user.custom_id,
            billing_subscription_id: user.billing_subscription_id
        };
    }
}

module.exports = {
  JwtProvisioningPlugin,
};