import React from "react";
import Auth0Settings from "./Auth0Settings";
import OktaSettings from "./OktaSettings";

const openStripeManagement = (email) => {
  window.open(
    `${import.env.VITESTRIPE_MANAGEMENT_URL}?prefilled_email=${email}`,
    "_blank",
    "noreferrer"
  );
};

const Settings = () => {
  if (import.env.VITEAUTH_PROVIDER === "Okta") {
    return <OktaSettings openStripeManagement={openStripeManagement} />;
  } else if (import.env.VITEAUTH_PROVIDER === "Auth0") {
    return <Auth0Settings openStripeManagement={openStripeManagement} />;
  }
};

export default Settings;
