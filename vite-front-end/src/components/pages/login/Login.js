import React from "react";
import OktaLogin from "./OktaLogin";
import Auth0Login from "./Auth0Login";

export default function Login() {
  if (import.env.VITEAUTH_PROVIDER === "Okta") {
    return <OktaLogin />;
  } else if (import.env.VITEAUTH_PROVIDER === "Auth0") {
    return <Auth0Login />;
  }
}
