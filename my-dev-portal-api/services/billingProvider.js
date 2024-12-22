function generateGUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0; // Generate a random number between 0 and 15
    const v = c === "x" ? r : (r & 0x3) | 0x8; // Use 0-15 for 'x' and 8-11 for 'y'
    return v.toString(16); // Convert to hexadecimal
  });
}

function getOneMonthFromNowISO() {
  const now = new Date(); // Get the current date and time
  now.setMonth(now.getMonth() + 1); // Add one calendar month
  return now.toISOString(); // Convert to ISO 8601 format
}

/* Interface for Billing Provider */
class BillingProvider {
  verifyPurchaseAndCreateSubscription(req, data) {
    // use the request info to verify the purchase after checkout
    // but generally your billing provider should verify the subscription
    // and return the subscription object.
    // below is a fake subscription generated on the fly.

    const subscription = {
      id: generateGUID(),
      plan_id: req.query?.plan_id,
      current_period_start: new Date().toISOString(),
      current_period_end: getOneMonthFromNowISO(),
    };

    return {
      subscription,
    };
    // throw new Error('Verify Purchase Not Implemented.');
  }
}

module.exports = {
  BillingProvider,
};
