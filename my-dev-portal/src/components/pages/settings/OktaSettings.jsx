import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import { PageLayout } from "../../page-layout";
import { PageLoader } from "../../page-loader";

function OktaSettings(props) {
  const { authState } = useOktaAuth();

  const { openStripeManagement } = props;

  let isLoading = authState?.isPending,
    isAuthenticated = authState?.isAuthenticated,
    user = authState?.idToken?.claims;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    isAuthenticated && (
      <PageLayout>
        <div className="page-heading">
          <p className="page-eyebrow">Account</p>
          <h1>Settings</h1>
          <p>Manage your profile and billing details.</p>
        </div>
        <div className="user-profile">
          {user.picture && (
            <img
              className="profile-picture"
              src={user.picture}
              alt={user.name}
            />
          )}
          <h2>{user.name || user.preferred_username}</h2>
        </div>
        <div className="page-layout__focus">
          <button
            className="button__purp"
            onClick={() =>
              openStripeManagement(user.email || user.preferred_username)
            }
          >
            Manage Billing
          </button>
        </div>
      </PageLayout>
    )
  );
}

export default OktaSettings;
