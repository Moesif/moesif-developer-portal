import React, { useState, useEffect } from "react";

import { PageLayout } from "../../page-layout";
import MoesifPlans from './MoesifPlans';
function Plans(props) {
  const planSource = process.env.REACT_APP_PLAN_SOURCE;


  console.log(process.env);

  if (planSource === 'moesif') {
    return <MoesifPlans />;
  }

  return (
    <PageLayout>
      <div className="page-layout__focus">
        {planSource === "StripePriceTable" && (
          <div className="stripe-pricing-table-container">
            <stripe-pricing-table
              pricing-table-id={process.env.REACT_APP_STRIPE_PRICING_TABLE_ID}
              publishable-key={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
            ></stripe-pricing-table>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default Plans;
