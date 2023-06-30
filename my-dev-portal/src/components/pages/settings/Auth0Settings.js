import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../../page-layout";
import { PageLoader } from "../../page-loader";

function Auth0Settings(props) {
  const { user: auth0User, isAuthenticated: auth0IsAuthenticated, isLoading: auth0IsLoading } = useAuth0();

  const { openStripeManagement } = props;

  let isLoading = auth0IsLoading, isAuthenticated = auth0IsAuthenticated, user = auth0User;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    isAuthenticated && (
      <PageLayout>
        <div>
          {user.picture && <img src={user.picture} alt={user.name} />}
          <h2 className="white-text">{user.name}</h2>
        </div>
        <div>
          <button
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
