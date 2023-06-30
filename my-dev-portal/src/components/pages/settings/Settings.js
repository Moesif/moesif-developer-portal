import React from "react";
import Auth0Settings from "./Auth0Settings";
import OktaSettings from "./OktaSettings";

const openStripeManagement = (email) => {
  window.open(
    `${process.env.REACT_APP_STRIPE_MANAGEMENT_URL}?prefilled_email=${email}`,
    "_blank",
    "noreferrer"
  );
};

const Settings = () => {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return <OktaSettings openStripeManagement={openStripeManagement} />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return <Auth0Settings openStripeManagement={openStripeManagement} />;
  }
};

export default Settings;
