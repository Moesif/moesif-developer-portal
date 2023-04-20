import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../page-layout";
import { PageLoader } from "../page-loader";

const Settings = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  console.log(user);

  if (isLoading) {
    return <PageLoader />;
  }

  const openStripeManagement = () => {
    window.open(
      `https://billing.stripe.com/p/login/test_dR68yF4EXbFMgKc3cc?prefilled_email=${user.email}`,
      "_blank",
      "noreferrer"
    );
  };

  return (
    isAuthenticated && (
      <PageLayout>
        <div>
          <img src={user.picture} alt={user.name} />
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
