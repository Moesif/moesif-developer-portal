import React from "react";
import OktaLogin from "./OktaLogin";
import Auth0Login from "./Auth0Login";
import AsgardeoLogin from "./AsgardeoLogin";

export default function Login() {
  console.log("in login");
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return <OktaLogin />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return <Auth0Login />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Asgardeo") {
    return <AsgardeoLogin />;
  } 
}
