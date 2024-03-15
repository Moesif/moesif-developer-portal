import React from "react";

import { PageLayout } from "../../page-layout";
import useSubscriptions from "../../../hooks/useSubscriptions";
import useAuthCombined from "../../../hooks/useAuthCombined";
import { PageLoader } from "../../page-loader";
import { Link } from "react-router-dom";

const exampleSubs = [
  {
    trial_start: null,
    company_id: "sub_1OUHDjKjbeAxuumJy6ko1gXu",
    "@timestamp": "2024-03-02T23:19:18.076Z",
    start_date: "2024-01-02T23:18:03.000Z",
    collection_method: "charge_automatically",
    provider: "stripe",
    items: [
      {
        price_id: "price_1OUD7XKjbeAxuumJwK5agr87",
        price: {
          provider: "stripe",
          price_in_decimal: 50,
          period_units: "M",
          plan_id: "prod_PIolHSJQuNP5Wm",
          id: "price_1OUD7XKjbeAxuumJwK5agr87",
          status: "active",
          pricing_model: "flat",
          tax_behavior: "unspecified",
          currency: "USD",
          metadata: {},
          created_at: "2024-01-02T18:55:23.000",
          usage_aggregator: null,
          period: 1,
        },
        plan_id: "prod_PIolHSJQuNP5Wm",
        status: "active",
        created_at: "2024-01-02T23:18:03.000Z",
        subscription_item_id: "si_PIszPQaPC3zIZL",
        plan: {
          provider: "stripe",
          id: "prod_PIolHSJQuNP5Wm",
          status: "active",
          metadata: {},
          created_at: "2024-01-02T18:55:23.000",
        },
      },
      {
        price_id: "price_1OUG3zKjbeAxuumJ3Zmidpum",
        price: {
          provider: "stripe",
          price_in_decimal: 1,
          period_units: "M",
          plan_id: "prod_PIolHSJQuNP5Wm",
          id: "price_1OUG3zKjbeAxuumJ3Zmidpum",
          status: "active",
          pricing_model: "per_unit",
          tax_behavior: "unspecified",
          currency: "USD",
          metadata: {},
          created_at: "2024-01-02T22:03:55.000",
          usage_aggregator: "sum",
          period: 1,
        },
        plan_id: "prod_PIolHSJQuNP5Wm",
        status: "active",
        created_at: "2024-01-03T03:06:09.000Z",
        subscription_item_id: "si_PIwfDNLxCl3oxz",
        plan: {
          provider: "stripe",
          id: "prod_PIolHSJQuNP5Wm",
          status: "active",
          metadata: {},
          created_at: "2024-01-02T22:03:55.000",
        },
      },
    ],
    current_period_start: "2024-03-02T23:18:03.000Z",
    company_external_id: "cus_PIsz7TqLLrheqX",
    payment_status: null,
    modified_time: "2024-03-02T23:19:17.901Z",
    cancel_time: null,
    status: "active",
    trial_end: null,
    external_id: null,
    metadata: {},
    app_id: "660:387",
    subscription_id: "sub_1OUHDjKjbeAxuumJy6ko1gXu",
    version_id: "evt_1Oq1ppKjbeAxuumJU52yYGdo",
    type: "subscription",
    current_period_end: "2024-04-02T23:18:03.000Z",
    "@version": "1",
    org_id: "88:210",
    created: "2024-01-02T23:18:03.000Z",
  },
];

function SubDisplay({ sub }) {
  return (
    <div>
      <table>
        <tr>
          <td>Provider</td>
          <td>{sub.provider}</td>
        </tr>
        <tr>
          <td>Current Period</td>
          <td>
            {sub.current_period_start} to {sub.current_period_end}
          </td>
        </tr>
        {sub.item?.map((item) => (
          <tr key={item.subscription_item_id + item.price_id + item.plan_id}>
            <td>plan id: {item.plan_id}</td>
            <td>
              {item.price?.price_in_decimal} {item.price?.currency}{" "}
              {item.price?.price_in_decimal.pricing_model}{" "}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}

function Subscription(props) {
  const { isAuthenticated, isLoading, user } = useAuthCombined();
  const { subscriptions, finishedLoading } = useSubscriptions(user);

  if (isLoading || !finishedLoading) {
    return <PageLoader />;
  }

  return (
    <PageLayout>
      <h3>Subscriptions</h3>
      {(!subscriptions || subscriptions.length <= 0) && (
        <p>
          No Subscriptions found. Please go to{" "}
          <Link to="/plans">Plans page </Link> and select a plan
        </p>
      )}
      {subscriptions?.length > 0 && (
        <>
          {subscriptions.map((sub) => (
            <SubDisplay sub={sub} key={sub.subscription_id} />
          ))}
        </>
      )}
    </PageLayout>
  );
}

export default Subscription;
