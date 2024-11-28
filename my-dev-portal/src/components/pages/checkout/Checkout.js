import React from "react";

import useAuthCombined from "../../../hooks/useAuthCombined";
import { PageLoader } from "../../page-loader";
import { PageLayout } from "../../page-layout";
import CheckoutForm from "./CheckoutForm";
import { Navigate } from "react-router-dom";

function Checkout(props) {
  const { isLoading, user, idToken } = useAuthCombined();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const urlPriceIdToPurchase = urlParams.get("price_id_to_purchase");

  if (isLoading || !idToken) {
    return <PageLoader />;
  }

  if (!urlPriceIdToPurchase) {
    <Navigate to="/plans" />;
  }

  return (
    <PageLayout>
      <h1>Subscribe</h1>
      <div className="page-layout__focus">
        <CheckoutForm
          key={urlPriceIdToPurchase}
          priceId={urlPriceIdToPurchase}
          user={user}
          idToken={idToken}
        />
      </div>
    </PageLayout>
  );
}

export default Checkout;
