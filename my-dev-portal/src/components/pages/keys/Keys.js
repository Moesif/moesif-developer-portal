import React from "react";
import Auth0Keys from "./Auth0Keys";
import OktaKeys from "./OktaKeys";
import AsgardeoKeys from "./AsgardeoKeys";

export default function Keys() {
  console.log("in keys");
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return <OktaKeys />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return <Auth0Keys />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Asgardeo") {
    return <AsgardeoKeys />;
  }
}
