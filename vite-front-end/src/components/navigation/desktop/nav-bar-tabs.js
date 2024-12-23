import React from "react";
import Auth0NavBarTabs from "./auth0-nav-bar-tabs";
import OktaNavBarTabs from "./okta-nav-bar-tabs";

export const NavBarTabs = () => {
  if (import.env.VITEAUTH_PROVIDER === "Okta") {
    return <OktaNavBarTabs />;
  } else if (import.env.VITEAUTH_PROVIDER === "Auth0") {
    return <Auth0NavBarTabs />;
  }
};
