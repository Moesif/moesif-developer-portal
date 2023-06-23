import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../page-layout";
import { PageLoader } from "../page-loader";

const Settings = () => {
  const { authState } = useOktaAuth();
  const { user: auth0User, isAuthenticated: auth0IsAuthenticated, isLoading: auth0IsLoading } = useAuth0();

  let isLoading, isAuthenticated, user;

  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    isLoading = authState?.isPending;
    isAuthenticated = authState?.isAuthenticated;
    user = authState?.idToken?.claims;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    isLoading = auth0IsLoading;
    isAuthenticated = auth0IsAuthenticated;
    user = auth0User;
  }

  if (isLoading) {
    return <PageLoader />;
  }

  const openStripeManagement = () => {
    window.open(
      `${process.env.REACT_APP_STRIPE_MANAGEMENT_URL}?prefilled_email=${user.email}`,
      "_blank",
      "noreferrer"
    );
  };

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
