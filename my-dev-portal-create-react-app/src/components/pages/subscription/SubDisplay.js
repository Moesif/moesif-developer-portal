import React from "react";
import { formatIsoTimestamp } from "../../../common/utils";
import PriceTile from "../plans/PriceTile";

// const exampleSubs = [
//   {
//     trial_start: null,
//     company_id: "sub_1OUHDjKjbeAxuumJy6ko1gXu",
//     "@timestamp": "2024-03-02T23:19:18.076Z",
//     start_date: "2024-01-02T23:18:03.000Z",
//     collection_method: "charge_automatically",
//     provider: "stripe",
//     items: [
//       {
//         price_id: "price_1OUD7XKjbeAxuumJwK5agr87",
//         price: {
//           provider: "stripe",
//           price_in_decimal: 50,
//           period_units: "M",
//           plan_id: "prod_PIolHSJQuNP5Wm",
//           id: "price_1OUD7XKjbeAxuumJwK5agr87",
//           status: "active",
//           pricing_model: "flat",
//           tax_behavior: "unspecified",
//           currency: "USD",
//           metadata: {},
//           created_at: "2024-01-02T18:55:23.000",
//           usage_aggregator: null,
//           period: 1,
//         },
//         plan_id: "prod_PIolHSJQuNP5Wm",
//         status: "active",
//         created_at: "2024-01-02T23:18:03.000Z",
//         subscription_item_id: "si_PIszPQaPC3zIZL",
//         plan: {
//           provider: "stripe",
//           id: "prod_PIolHSJQuNP5Wm",
//           status: "active",
//           metadata: {},
//           created_at: "2024-01-02T18:55:23.000",
//         },
//       },
//       {
//         price_id: "price_1OUG3zKjbeAxuumJ3Zmidpum",
//         price: {
//           provider: "stripe",
//           price_in_decimal: 1,
//           period_units: "M",
//           plan_id: "prod_PIolHSJQuNP5Wm",
//           id: "price_1OUG3zKjbeAxuumJ3Zmidpum",
//           status: "active",
//           pricing_model: "per_unit",
//           tax_behavior: "unspecified",
//           currency: "USD",
//           metadata: {},
//           created_at: "2024-01-02T22:03:55.000",
//           usage_aggregator: "sum",
//           period: 1,
//         },
//         plan_id: "prod_PIolHSJQuNP5Wm",
//         status: "active",
//         created_at: "2024-01-03T03:06:09.000Z",
//         subscription_item_id: "si_PIwfDNLxCl3oxz",
//         plan: {
//           provider: "stripe",
//           id: "prod_PIolHSJQuNP5Wm",
//           status: "active",
//           metadata: {},
//           created_at: "2024-01-02T22:03:55.000",
//         },
//       },
//     ],
//     current_period_start: "2024-03-02T23:18:03.000Z",
//     company_external_id: "cus_PIsz7TqLLrheqX",
//     payment_status: null,
//     modified_time: "2024-03-02T23:19:17.901Z",
//     cancel_time: null,
//     status: "active",
//     trial_end: null,
//     external_id: null,
//     metadata: {},
//     app_id: "660:387",
//     subscription_id: "sub_1OUHDjKjbeAxuumJy6ko1gXu",
//     version_id: "evt_1Oq1ppKjbeAxuumJU52yYGdo",
//     type: "subscription",
//     current_period_end: "2024-04-02T23:18:03.000Z",
//     "@version": "1",
//     org_id: "88:210",
//     created: "2024-01-02T23:18:03.000Z",
//   },
// ];

function SubDisplay({ sub, plans }) {
  const items = sub?.items;

  if (!items) {
    return "";
  }

  const subscriptionPeriod = `${formatIsoTimestamp(
    sub.current_period_start
  )} - ${formatIsoTimestamp(sub.current_period_end)}`;

  return (
    <>
      {items.map((item) => {
        const planId = item.plan_id;
        const priceId = item.price_id;

        const foundPlan = plans.find((plan) => plan.id === planId);

        const foundPrice = foundPlan?.prices.find(
          (price) => price.id === priceId
        );

        if (!foundPlan || !foundPrice) {
          return (
            <div className="price--tile">
              <div plan--content>
                <div className="price-name">Plan and Price not found</div>
                <div
                  className="single-price--unit"
                  style={{ paddingTop: "1em", paddingBottom: "1em" }}
                >
                  Was plan or price deleted in Stripe or not synced?
                </div>
                <p className="text-muted">
                  Please check if plan id <code>{planId}</code> & price id{" "}
                  <code>{priceId}</code> exits in your list of plans.
                </p>
              </div>
            </div>
          );
        }

        return (
          <PriceTile
            key={`${planId}-${priceId}`}
            plan={foundPlan}
            price={foundPrice}
            subscriptionPeriod={subscriptionPeriod}
            actionButton={
              <button disabled className="button__price-action">
                Manage{" "}
                <span style={{ fontSize: "x-small", fontWeight: "300" }}>
                  TBI
                </span>
              </button>
            }
          />
        );
      })}
    </>
  );
}

export default SubDisplay;
