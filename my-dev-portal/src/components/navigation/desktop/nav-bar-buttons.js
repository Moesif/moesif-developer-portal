import React from "react";
import Auth0NavBarButtons from "./auth0-nav-bar-buttons";
import OktaNavBarButtons from "./okta-nav-bar-buttons";

export const NavBarButtons = () => {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return <OktaNavBarButtons />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return <Auth0NavBarButtons />;
  } 
};
