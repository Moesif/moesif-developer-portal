import React, { useState, useEffect } from "react";

import { PageLayout } from "../../page-layout";
import { PageLoader } from "../../page-loader";

import SinglePlan from "./SinglePlan";
import CheckoutForm from "./CheckoutForm";
import useAuthCombined from "../../../hooks/useAuthCombined";

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
  const { isAuthenticated, isLoading, user, handleSignUp } = useAuthCombined();

  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState(null);
  const [error, setError] = useState();

  const [priceToPurchase, setPriceToPurchase] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/plans`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const loadedPlans = result?.hits || [];
        setPlans(loadedPlans);
        setLoading(false);

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const urlPriceIdToPurchase = urlParams.get("price_id_to_purchase");

        if (urlPriceIdToPurchase) {
          // lets find the price
          // so we can continue the purchase experience
          let foundPrice = null;
          loadedPlans.forEach(plan => {
            const innerPrices = plan?.prices || [];
            const found = innerPrices.find(pr=> pr.id === urlPriceIdToPurchase);
            if (found) {
              foundPrice = found;
            }
          });

          if (foundPrice) {
            // so we can continue the purchase flow
            // for the price that customer already select
            setPriceToPurchase(foundPrice);
          }
        }
      })
      .catch((err) => {
        console.log("failed to load plans", err);
        setLoading(false);
        setError(err);
      });
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  const onSelectPrice = (price, plan) => {
    // for purchases of this example
    // for onboard flow, if user is not registered,
    // we ask user to register/signin/signup first
    // then comeback and continue purchase.
    // For your specific business requirements,
    // your onboarding steps and flow may be different.
    if (isAuthenticated) {
      setPriceToPurchase(price);
    } else {
      // we have to initiate login process and return back to continue
      handleSignUp({
        returnTo: `/plans?price_id_to_purchase=${encodeURIComponent(price.id)}`,
      });
    }
  };

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
              onSelectPrice={onSelectPrice}
            />
          ))}
      </div>
      {priceToPurchase && isAuthenticated && (
        <CheckoutForm price={priceToPurchase} user={user} />
      )}
    </PageLayout>
  );
}

export default MoesifPlans;
