import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// used on embedded checkout example code:
// https://docs.stripe.com/checkout/embedded/quickstart

function CheckoutForm({ price, plan }) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create a Checkout Session as soon as the page loads
    fetch(
      `${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/create-stripe-checkout-session?price_id=${price.id}`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [price]);

  return (
    <div id="checkout">
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}

export default CheckoutForm;
