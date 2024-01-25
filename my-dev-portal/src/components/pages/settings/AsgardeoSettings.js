import React from "react";

import { useAuthContext } from "@asgardeo/auth-react";
import { PageLayout } from "../../page-layout";
import { PageLoader } from "../../page-loader";

function AsgardeoSettings(props) {
  const { state } = useAuthContext();
  const { openStripeManagement } = props;

  let isLoading = state.isLoading,
    isAuthenticated = state.isAuthenticated,
    user = state.email || state.username;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    isAuthenticated && (
      <PageLayout>
        <h1>Settings</h1>
        <div className="user-profile">
          {user.picture && (
            <img
              className="profile-picture"
              src={user.picture}
              alt={user.name}
            />
          )}
          <h1>{user.name}</h1>
        </div>
        <div className="page-layout__focus">
          <button
            disabled={!user.email}
            className="button__purp"
            onClick={() => openStripeManagement(user.email)}
          >
            Manage Billing
          </button>
        </div>
      </PageLayout>
    )
  );
}

export default AsgardeoSettings;
