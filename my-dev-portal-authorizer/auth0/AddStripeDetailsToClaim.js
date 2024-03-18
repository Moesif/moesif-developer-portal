/****************************************************
 * This handler should be added to the Auth0 Login Flow (Actions > Flows > Login).
 * By adding this in, the Stripe data that is saved to the Auth0 profile will now be injected into the claim
 * so it can be mapped to the principalId field in AWS Gateway
 */

/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  api.accessToken.setCustomClaim(
    "stripeCustomerId",
    event.user.app_metadata.stripeCustomerId
  );
  api.accessToken.setCustomClaim(
    "stripeSubscriptionId",
    event.user.app_metadata.stripeSubscriptionId
  );
};

/**
 * Handler that will be invoked when this action is resuming after an external redirect. If your
 * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onContinuePostLogin = async (event, api) => {
  api.accessToken.setCustomClaim(
    "stripeCustomerId",
    event.user.app_metadata.stripeCustomerId
  );
  api.accessToken.setCustomClaim(
    "stripeSubscriptionId",
    event.user.app_metadata.stripeSubscriptionId
  );
};
