import { useOktaAuth } from "@okta/okta-react";
import { PageLayout } from "../page-layout";
import { PageLoader } from "../page-loader";

export default function StripeProducts() {
  const { authState } = useOktaAuth();

  if (!authState || authState.isPending) {
    return <PageLoader />;
  }

  const user = authState?.idToken?.claims;

  return (
    <PageLayout>
      <stripe-pricing-table 
        pricing-table-id={process.env.REACT_APP_STRIPE_PRICING_TABLE_ID}
        publishable-key={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
        customer-email={user.email}
      >
      </stripe-pricing-table>
    </PageLayout>
  );
}
