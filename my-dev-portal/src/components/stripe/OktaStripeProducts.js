import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import { PageLayout } from "../page-layout";
import { PageLoader } from "../page-loader";

export default function OktaStripeProducts() {
  const { authState } = useOktaAuth();

  let isLoading = !authState || authState?.isPending;
  let user = authState?.idToken?.claims;


  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <PageLayout>
      <stripe-pricing-table
        pricing-table-id={process.env.REACT_APP_STRIPE_PRICING_TABLE_ID}
        publishable-key={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
        customer-email={user.email || user.preferred_username}
      ></stripe-pricing-table>
    </PageLayout>
  );
}
