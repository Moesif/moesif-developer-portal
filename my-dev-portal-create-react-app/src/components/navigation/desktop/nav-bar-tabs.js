import React from "react";
import Auth0NavBarTabs from "./auth0-nav-bar-tabs";
import OktaNavBarTabs from "./okta-nav-bar-tabs";

export const NavBarTabs = () => {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return <OktaNavBarTabs />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return <Auth0NavBarTabs />;
  }
};
