import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { PageLayout } from "../../page-layout";
import { Link } from "react-router-dom";
import noPriceIcon from "../../../images/icons/empty-state-price.svg";
import NoticeBox from "../../notice-box";
import useAuthCombined from '../../../hooks/useAuthCombined';

// used on embedded checkout example code:
// https://docs.stripe.com/checkout/embedded/quickstart
// Purpose of this page is to
// - Confirmation for customer
// - receive the returned sessionId from Stripe and call backend API to provision services.

function Return(props) {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const { idToken } = useAuthCombined();

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
            'Authorization': `Bearer ${idToken}`,
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
        <h1>Subscribe</h1>
        <NoticeBox
          iconSrc={noPriceIcon}
          title="Success"
          description={`You are now subscription to the plan and price. A email should be sent to ${customerEmail}`}
          actions={
            <>
              <a
                href="https://www.moesif.com/docs/developer-portal/"
                target="_blank"
                rel="noreferrer noopener"
              >
                <button className="button button__link">See Docs</button>
              </a>
              <Link to="/keys" rel="noreferrer noopener">
                <button className="button button--outline-secondary">
                  Get API Key
                </button>
              </Link>
            </>
          }
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1>Subscribe Status</h1>
      <NoticeBox
        iconSrc={noPriceIcon}
        title="Checkout Failed"
        description="Seems you didn't checkout successfully?"
        actions={
          <>
            <a
              href="https://www.moesif.com/docs/developer-portal/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <button className="button button__link">See Docs</button>
            </a>
            <Link to="/plans" rel="noreferrer noopener">
              <button className="button button--outline-secondary">
                Go to Plans
              </button>
            </Link>
          </>
        }
      />
    </PageLayout>
  );
}

export default Return;
