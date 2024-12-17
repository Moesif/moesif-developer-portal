

/* Interface for Billing Provider */
class BillingProvider {
  verifyPurchase(req) {
    // generally use the request info to verify the purchase after checkout
    return { subscription_id: "abc" };
    // throw new Error('Verify Purchase Not Implemented.');
  }
}

module.exports = {
  BillingProvider,
};
