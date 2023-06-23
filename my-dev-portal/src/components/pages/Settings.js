import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import { PageLayout } from "../page-layout";
import { PageLoader } from "../page-loader";

const Settings = () => {
  const { authState } = useOktaAuth();

  if (authState.isPending) {
    return <PageLoader />;
  }

  const user = authState?.idToken?.claims;
  
  const openStripeManagement = () => {
    window.open(
      `${process.env.REACT_APP_STRIPE_MANAGEMENT_URL}?prefilled_email=${user.email}`,
      "_blank",
      "noreferrer"
    );
  };

  return (
    authState.isAuthenticated && (
      <PageLayout>
        <div>

          <h2 className="white-text">{user.name}</h2>
        </div>
        <div>
          <button
            className="button__purp"
            onClick={() => openStripeManagement()}
          >
            Manage Billing
          </button>
        </div>
      </PageLayout>
    )
  );
};

export default Settings;
