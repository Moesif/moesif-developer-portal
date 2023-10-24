import React from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { PageLayout } from "../page-layout";
import { PageLoader } from "../page-loader";

export default function AsgardeoStripeProducts() {
  const { state } = useAuthContext();
  let userEmail = state.email || state.username;
  let isLoading = state.isLoading;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <PageLayout hideNavTabs>
      <h1>Select Plan</h1>
      <h3>Select a payment plan to finish setting up your account.</h3>
      <div className="page-layout__focus">
        <div className="stripe-pricing-table-container">
          <stripe-pricing-table
            pricing-table-id={process.env.REACT_APP_STRIPE_PRICING_TABLE_ID}
            publishable-key={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
            customer-email={userEmail}
          ></stripe-pricing-table>
        </div>
      </div>
    </PageLayout>
  );
}
