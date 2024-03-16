import React, { useState, useEffect } from "react";

import { PageLayout } from "../../page-layout";
import MoesifPlans from "./MoesifPlans";

function Plans(props) {
  const useStripePriceTable = process.env.REACT_APP_USE_STRIPE_PRICE_TABLE;

  return (
    <PageLayout>
      {!useStripePriceTable ? (
        <MoesifPlans />
      ) : (
        <div className="page-layout__focus">
          <div className="stripe-pricing-table-container">
            <stripe-pricing-table
              pricing-table-id={process.env.REACT_APP_STRIPE_PRICING_TABLE_ID}
              publishable-key={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
            ></stripe-pricing-table>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default Plans;
