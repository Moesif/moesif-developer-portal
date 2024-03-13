import React, { useState, useEffect } from "react";

import { PageLayout } from "../../page-layout";
import { PageLoader } from "../../page-loader";

import wfImage from "../../../images/assets/wf-diagram.png";
import { SignupButton } from "../../buttons/signup-button";
import { LoginButton } from "../../buttons/login-button";
import SinglePlan from "./SinglePlan";
import CheckoutForm from "./CheckoutForm";

const fakeData = {
  hits: [
    {
      provider: "stripe",
      id: "prod_PhZZOeq5yuBGif",
      name: "Moesif Plan2",
      status: "active",
      description: "plan2",
      metadata: {},
      unit: "moesif plan2",
      created_at: "2024-03-08T20:54:12.000",
      updated_at: "2024-03-08T20:54:12.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1OsAR5Hg4eDYeXd9OQSSzgEH",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "moesif price 2",
          plan_id: "prod_PhZZOeq5yuBGif",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "0.01",
          pricing_model: "per_unit",
          created_at: "2024-03-08T20:54:35.000",
          tax_behavior: "unspecified",
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_PhZEnxMONTleZy",
      name: "My New Moesif Stripe Product",
      status: "active",
      metadata: {},
      unit: "Price 2",
      created_at: "2024-03-08T20:33:14.000",
      updated_at: "2024-03-08T20:33:14.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1OsA6yHg4eDYeXd9lXrKeZCJ",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "Moesif Price",
          plan_id: "prod_PhZEnxMONTleZy",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "0.01",
          pricing_model: "per_unit",
          created_at: "2024-03-08T20:33:48.000",
          tax_behavior: "unspecified",
          transform_quantity: {
            divide_by: 20,
            round: "up",
          },
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_ON7eBWIlezBDDL",
      name: "First Product",
      status: "active",
      description: "Api product",
      metadata: {},
      created_at: "2023-08-01T18:34:40.000",
      updated_at: "2023-08-01T18:35:40.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1NaNP2Hg4eDYeXd9RkSVPFt4",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "5 cents per unit",
          plan_id: "prod_ON7eBWIlezBDDL",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "0.05",
          pricing_model: "per_unit",
          created_at: "2023-08-01T18:34:40.000",
          tax_behavior: "unspecified",
        },
      ],
    },
  ],
  failures: [],
};

function MoesifPlans(props) {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState(null);
  const [error, setError] = useState();

  const [priceToPurchase, setPriceToPurchase] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/plans`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setPlans(result?.hits || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log("failed to load plans", err);
        setError(err);
      });
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <PageLayout>
      <div className="page-layout__focus">
        {!loading && !error && !plans && (
          <p>
            No Plans set up in Moesif. Please set create Plan in Moesif to
            stripe.
          </p>
        )}
        {plans &&
          plans.map((item) => (
            <SinglePlan
              key={item.id}
              plan={item}
              onPurchase={setPriceToPurchase}
            />
          ))}
      </div>
      {priceToPurchase && <CheckoutForm price={priceToPurchase} />}
    </PageLayout>
  );
}

export default MoesifPlans;
