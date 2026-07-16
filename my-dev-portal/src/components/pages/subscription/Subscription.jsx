import React from "react";

import { PageLayout } from "../../page-layout";
import useSubscriptions from "../../../hooks/useSubscriptions";
import useAuthCombined from "../../../hooks/useAuthCombined";
import { PageLoader } from "../../page-loader";
import { Link } from "react-router-dom";
import usePlans from "../../../hooks/usePlans";
import SVG from "react-inlinesvg";
import noPriceIcon from "../../../images/icons/empty-state-price.svg";
import SubDisplay from "./SubDisplay";

function Subscription(props) {
  const { isAuthenticated, isLoading, user, idToken, accessToken } =
    useAuthCombined();
  const { subscriptions, finishedLoading, subscriptionsError } =
    useSubscriptions({
      user,
      idToken,
      accessToken,
    });
  const { plansLoading, plans } = usePlans();

  if (
    isLoading ||
    !finishedLoading ||
    !isAuthenticated ||
    plansLoading ||
    !idToken
  ) {
    return <PageLoader />;
  }

  return (
    <PageLayout>
      <div className="page-heading">
        <p className="page-eyebrow">Billing</p>
        <h1>Subscriptions</h1>
        <p>Review your active plans and billing periods.</p>
      </div>
      {subscriptionsError && (
        <div className="alert-error" role="alert">
          We could not load your subscriptions. Please refresh the page or try
          again shortly.
        </div>
      )}
      {!subscriptionsError && (!subscriptions || subscriptions.length <= 0) && (
        <div className="empty-state">
          <SVG src={noPriceIcon} aria-hidden="true" />
          <h2>No active subscription yet</h2>
          <p>
            Your account is ready. Choose a plan to activate API access, then
            create a key and start making calls.
          </p>
          <p className="empty-state__hint">
            Just checked out? New subscriptions can take a few minutes to
            appear here.
          </p>
          <Link to="/plans">
            <button className="button button--primary">View plans</button>
          </Link>
        </div>
      )}
      {subscriptions?.length > 0 && (
        <div className="plans--container">
          {subscriptions.map((sub) => (
            <SubDisplay sub={sub} key={sub.subscription_id} plans={plans} />
          ))}
        </div>
      )}
      {subscriptions?.length > 0 && (
        <p className="text-muted">
          Recent changes to your plan can take a few minutes to appear here.
        </p>
      )}
    </PageLayout>
  );
}

export default Subscription;
