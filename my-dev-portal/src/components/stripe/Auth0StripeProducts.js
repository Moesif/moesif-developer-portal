import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../page-layout";
import { PageLoader } from "../page-loader";

export default function Auth0StripeProducts() {
  const { user: auth0User, isLoading: auth0IsLoading } = useAuth0();

  let isLoading = auth0IsLoading;
  let user = auth0User;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <PageLayout>
      <stripe-pricing-table
        pricing-table-id={process.env.REACT_APP_STRIPE_PRICING_TABLE_ID}
        publishable-key={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
        customer-email={user.email}
      ></stripe-pricing-table>
    </PageLayout>
  );
}
