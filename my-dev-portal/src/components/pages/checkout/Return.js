import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { PageLayout } from "../../page-layout";
import { Link } from "react-router-dom";
import noPriceIcon from "../../../images/icons/empty-state-price.svg";
import NoticeBox from "../../notice-box";
import useAuthCombined from "../../../hooks/useAuthCombined";
import { moesifIdentifyUserFrontEndIfPossible } from "../../../common/utils";
import { PageLoader } from "../../page-loader";

// used on embedded checkout example code:
// https://docs.stripe.com/checkout/embedded/quickstart
// Purpose of this page is to
// - Confirmation for customer
// - receive the returned sessionId from Stripe and call backend API to provision services.

function Return(props) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [provisionError, setProvisionError] = useState(null);
  const { idToken } = useAuthCombined();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const sessionId = urlParams.get("session_id");
  const priceId = urlParams.get("price_id");

  useEffect(() => {
    window.moesif?.track("stripe-checkout-returned", {
      stripe_session_id: sessionId,
      price_id: priceId,
      status,
    });

    if (sessionId && idToken) {
      setLoading(true);

      fetch(
        `${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/register/stripe/${sessionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      )
        .then(async (res) => {
          if (!res.ok) {
            const errorBody = await res.json();
            throw new Error(
              `Failed provision: ${res.status}, body: ${JSON.stringify(
                errorBody
              )}`
            );
          }
          return res.json();
        })
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
        })
        .catch((err) => {
          setProvisionError(err);
        })
        .finally(() => {
          setLoading(false);
          moesifIdentifyUserFrontEndIfPossible(idToken);
        });
    } else {
      console.error("no session id found");
    }
  }, [sessionId, idToken]);

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

  if (loading) {
    return <PageLoader />;
  }

  return (
    <PageLayout>
      <h1>Subscribe Status</h1>
      <NoticeBox
        iconSrc={noPriceIcon}
        title={provisionError ? "Provision Service Failed" : "Checkout Failed"}
        description={
          provisionError
            ? provisionError.toString() +
              " Please check the route /register/stripe/, and see if you set up provision plugin correctly for your API gateway."
            : "Seems you didn't checkout successfully?"
        }
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
