import React from "react";
import Auth0NavBarButtons from "./auth0-nav-bar-buttons";
import OktaNavBarButtons from "./okta-nav-bar-buttons";

export const NavBarButtons = () => {
  if (import.env.VITEAUTH_PROVIDER === "Okta") {
    return <OktaNavBarButtons />;
  } else if (import.env.VITEAUTH_PROVIDER === "Auth0") {
    return <Auth0NavBarButtons />;
  }
};
