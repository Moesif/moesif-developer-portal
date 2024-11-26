import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LineLoader } from "../../line-loader";
import NoPriceFound from "./NoPriceFound";
import PriceTile from "./PriceTile";
import { useAuth0 } from "@auth0/auth0-react";
import { SignupButton } from "../../buttons/signup-button";
import { examplePlansFromStripe } from "./examplePlansFromStripe";

const SHOW_EXAMPLE_PLANS = true;

function MoesifPlans({ skipExample }) {
  const { isAuthenticated } = useAuth0();

  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState(null);
  const [error, setError] = useState();

  const getActionButton = (price, plan, options) => {
    if (options?.disable) {
      return <button disabled className="button__price-action">Sign Up <span style={{ fontSize: "x-small", fontWeight: '300'}}>example</span></button>
    }
    if (isAuthenticated) {
      return (
        <Link to={`/checkout?price_id_to_purchase=${price.id}`}>
          <button className="button__price-action">Select</button>
        </Link>
      );
    } else {
      return <SignupButton isPriceAction />;
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/plans`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const loadedPlans = result?.hits || [];
        const activePlans = loadedPlans.filter(
          (item) => item.status === "active"
        );
        setPlans(activePlans);
        setLoading(false);
      })
      .catch((err) => {
        console.log("failed to load plans", err);
        setLoading(false);
        setError(err);
      });
  }, []);

  if (loading) {
    return <LineLoader />;
  }

  return (
    <div className="page-layout__content">
      <div className="plans-title-section">
        <h3 className="plans-title">My API Pricing</h3>
        <div className="plans-hint">
          <div>
            Developers: See read me file in this repo for setup instructions
          </div>
          <div>
            Or, jump to <Link to={"/setup"}>setup</Link> page to get started
          </div>
        </div>
      </div>
      {/* <NoPriceFound /> */}
      {error && <p>Error loading plans</p>}
      {!loading && !error && (!plans || plans.length === 0) && <NoPriceFound />}
      <div className="plans--container">
        {plans &&
          plans
            .filter((plan) => plan.status === "active")
            .map((plan) =>
              plan?.prices?.map((price) => (
                <PriceTile
                  key={`${plan.id}${price.id}`}
                  plan={plan}
                  price={price}
                  actionButton={getActionButton(price, plan)}
                />
              ))
            )
            .flat()}
      </div>
      {SHOW_EXAMPLE_PLANS && !skipExample && (
        <>
        <h3>Example Plans</h3>
        <div className="plans--container">
          {examplePlansFromStripe.hits
            .map((plan) =>
              plan?.prices?.map((price) => (
                <PriceTile
                  key={`${plan.id}${price.id}`}
                  plan={plan}
                  price={price}
                  actionButton={getActionButton(price, plan, { disable: true })}
                />
              ))
            )
            .flat()}
        </div>
        </>
      )}
    </div>
  );
}

export default MoesifPlans;
