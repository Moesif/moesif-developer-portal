import React from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../../page-layout";
import { PageLoader } from "../../page-loader";

function Auth0Settings(props) {
  const {
    user: auth0User,
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
  } = useAuth0();

  const { openStripeManagement } = props;

  let isLoading = auth0IsLoading,
    isAuthenticated = auth0IsAuthenticated,
    user = auth0User;

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

export default Auth0Settings;
