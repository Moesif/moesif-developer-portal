import React from "react";
import Auth0StripeProducts from "./Auth0StripeProducts";
import OktaStripeProducts from "./OktaStripeProducts";

// This is deprecated
// This is you prefer to use Stripe Price table, which offers less customization

export default function StripeProducts() {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return <OktaStripeProducts />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return <Auth0StripeProducts />;
  }
}
