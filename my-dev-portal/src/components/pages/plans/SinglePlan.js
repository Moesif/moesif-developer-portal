import React from "react";
import { Link } from "react-router-dom";

const exampleStripePlan = {
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
};

function SinglePlan(props) {
  const { plan, onSelectPrice } = props;
  const prices = plan?.prices || [];

  return (
    <div className="plan--single">
      <div>
        <h3>{plan.name}</h3>
        <div>{plan.description}</div>
      </div>
      <div>
        {prices.map((price) => (
          <div key={price.id}>
            <h5>{price.name}</h5>
            <div>
              {price.price_in_decimal} {price.per_unit}
            </div>
            <Link to={`/checkout?price_id_to_purchase=${price.id}`}>
              <button>Select</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SinglePlan;
