import React from "react";

import { PageLayout } from "../../page-layout";
import { PageLoader } from "../../page-loader";

import wfImage from "../../../images/assets/wf-diagram.png";
import { SignupButton } from "../../buttons/signup-button";
import { LoginButton } from "../../buttons/login-button";

function Plans(props) {
  const planSource = process.env.REACT_PLAN_SOURCE;

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
