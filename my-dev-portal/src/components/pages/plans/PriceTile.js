import React from "react";

const examplePlans = {
  hits: [
    {
      provider: "stripe",
      id: "prod_QrTtMZZndLkYzk",
      name: "Product lookup API",
      status: "active",
      metadata: {},
      created_at: "2024-09-16T19:49:40.000",
      updated_at: "2024-09-16T19:49:40.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1PzkwAHg4eDYeXd91KY0FjIm",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "Tiered Price",
          plan_id: "prod_QrTtMZZndLkYzk",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2024-09-16T19:50:18.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1000,
              unit_price_in_decimal: "0.05",
              flat_price_in_decimal: "0",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0.02",
              flat_price_in_decimal: "0",
            },
          ],
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_QXxnQTwjMmRxY4",
      name: "Test Plan3",
      status: "active",
      description: "Test plan for stripe 3",
      metadata: {},
      created_at: "2024-07-26T17:23:41.000",
      updated_at: "2024-07-26T17:23:41.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1QDEveHg4eDYeXd90WsyPTV1",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "mydecimalprice",
          plan_id: "prod_QXxnQTwjMmRxY4",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "1E-8",
          pricing_model: "per_unit",
          created_at: "2024-10-24T00:29:30.000",
          tax_behavior: "unspecified",
        },
        {
          provider: "stripe",
          id: "price_1Pgrs9Hg4eDYeXd9mBVLX6RE",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "test price3",
          plan_id: "prod_QXxnQTwjMmRxY4",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "0.023",
          pricing_model: "per_unit",
          created_at: "2024-07-26T17:24:05.000",
          tax_behavior: "unspecified",
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_PkZLDsgf1rPkHn",
      name: "Oliver Plan2",
      status: "active",
      description: "Advanced Plan",
      metadata: {},
      created_at: "2024-03-16T20:51:32.000",
      updated_at: "2024-03-16T20:51:32.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1Ov4CsHg4eDYeXd9PIYPkurA",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "Price2",
          plan_id: "prod_PkZLDsgf1rPkHn",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "0.02",
          pricing_model: "per_unit",
          created_at: "2024-03-16T20:51:54.000",
          tax_behavior: "unspecified",
          transform_quantity: {
            divide_by: 10,
            round: "up",
          },
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_PkZJjAUvYvHAz5",
      name: "Oliver Plan1",
      status: "active",
      description: "Basic Plan",
      metadata: {},
      created_at: "2024-03-16T20:50:11.000",
      updated_at: "2024-03-16T20:50:11.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1Ov4C0Hg4eDYeXd9WAj5Tqvh",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "Price1",
          plan_id: "prod_PkZJjAUvYvHAz5",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "0.01",
          pricing_model: "per_unit",
          created_at: "2024-03-16T20:51:00.000",
          tax_behavior: "unspecified",
          transform_quantity: {
            divide_by: 100,
            round: "up",
          },
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_PhZZOeq5yuBGif",
      name: "Moesif Plan2",
      status: "archived",
      description: "plan2",
      metadata: {},
      unit: "moesif plan2",
      created_at: "2024-03-08T20:54:12.000",
      updated_at: "2024-03-16T20:08:29.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1OsAR5Hg4eDYeXd9OQSSzgEH",
          status: "archived",
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
      status: "archived",
      metadata: {},
      unit: "Price 2",
      created_at: "2024-03-08T20:33:14.000",
      updated_at: "2024-03-16T20:08:35.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1OsA6yHg4eDYeXd9lXrKeZCJ",
          status: "archived",
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
      status: "archived",
      description: "Api product",
      metadata: {},
      created_at: "2023-08-01T18:34:40.000",
      updated_at: "2024-03-16T20:08:38.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1NaNP2Hg4eDYeXd9RkSVPFt4",
          status: "archived",
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

function TierTable(props) {
  const { tiers } = props;

  const doesTierHaveFlatFee = tiers.some(
    (item) => !!item.flat_price_in_decimal
  );
  const doesTierHaveUnitPrice = tiers.some(
    (item) => !!item.unit_price_in_decimal
  );
}

function PriceTile(props) {
  const { price, plan } = props;

  return (
    <div>
      <div>{price.name}</div>
      {price.tiers?.map((tier, index) => (
        <TierRow tier={tier} prevTier={price.tiers[index - 1]} />
      ))}
    </div>
  );
}

export default PriceTile;
