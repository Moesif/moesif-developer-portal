import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { PageLayout } from '../../page-layout';

// used on embedded checkout example code:
// https://docs.stripe.com/checkout/embedded/quickstart
// Purpose of this page is to
// - Confirmation for customer
// - receive the returned sessionId from Stripe and call backend API to provision services.

function Return(props) {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const sessionId = urlParams.get("session_id");
  const priceId = urlParams.get("price_id");

  useEffect(() => {
    if (sessionId) {
      fetch(
        `${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/register/stripe/${sessionId}`,
        {
          method: "POST",
          headers: {
            // 'Authorization': should be the auth0 access token.
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
        });
    } else {
      console.error("no session id found");
    }
  }, [sessionId]);

  if (status === "open") {
    return <Navigate to={`/checkout?price_id_to_purchase=${priceId}`} />;
  }

  if (status === "complete" && sessionId) {
    return (
      <PageLayout>
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail}. If you have any questions, please email{" "}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
        <p>
          For developers, if you setup API Management, you can go to Keys, and
          get your API keys.
        </p>
      </section>
      </PageLayout>
    );
  }

  return null;
}

export default Return;
