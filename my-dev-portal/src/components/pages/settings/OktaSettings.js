import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import { PageLayout } from "../../page-layout";
import { PageLoader } from "../../page-loader";

function OktaSettings(props) {
  const { authState } = useOktaAuth();

  const { openStripeManagement } = props;

  let isLoading = authState?.isPending, isAuthenticated = authState?.isAuthenticated, user = authState?.idToken?.claims;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    isAuthenticated && (
      <PageLayout>
        <div>
          {user.picture && <img src={user.picture} alt={user.name} />}
          <h2 className="white-text">{user.name || user.preferred_username}</h2>
        </div>
        <div>
          <button
            className="button__purp"
            onClick={() => openStripeManagement(user.email || user.preferred_username)}
          >
            Manage Billing
          </button>
        </div>
      </PageLayout>
    )
  );
}

export default OktaSettings;
