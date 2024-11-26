import React from "react";

import { PageLayout } from "../../page-layout";
import useSubscriptions from "../../../hooks/useSubscriptions";
import useAuthCombined from "../../../hooks/useAuthCombined";
import { PageLoader } from "../../page-loader";
import { Link } from "react-router-dom";
import { formatIsoTimestamp } from "../../../common/utils";
import usePlans from "../../../hooks/usePlans";
import NoticeBox from "../../notice-box";
import noPriceIcon from "../../../images/icons/empty-state-price.svg";

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

function SubDisplay({ sub }) {
  return (
    <div className="sub-table">
      <table>
        <tr>
          <td>Provider</td>
          <td>{sub.provider}</td>
        </tr>
        <tr>
          <td>Current Period</td>
          <td>
            {formatIsoTimestamp(sub.current_period_start)} -{" "}
            {formatIsoTimestamp(sub.current_period_end)}
          </td>
        </tr>
        {sub.items?.map((item) => (
          <tr key={item.subscription_item_id + item.price_id + item.plan_id}>
            <td>
              plan: {item.plan?.name}
              <br />
              price: {item?.price?.name}
            </td>
            <td>
              {item.price?.price_in_decimal}
              Price Model: {item.price?.pricing_model}{" "}
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
  const { plansError, plansLoading, plans } = usePlans();

  if (isLoading || !finishedLoading || !isAuthenticated || plansLoading) {
    return <PageLoader />;
  }
  /*
            For developers, if you want subscriptions to sync faster, you can
            locally cache the subscription in your system. In this example
            project, there is no local database or storage.
   */

  return (
    <PageLayout>
      <h1>My Current Subscriptions</h1>
      {(!subscriptions || subscriptions.length <= 0) && (
        <>
          <NoticeBox
            iconSrc={noPriceIcon}
            title="No Subscription found"
            description={
              <span>
                If you just purchased a plan, please{" "}
                <strong>wait at least 10 to 15 minutes</strong>{" "}
                for the systems to sync.
              </span>
            }
            actions={
              <>
                <a
                  href="https://www.moesif.com/docs/product-catalog/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <button className="button button__link">See Docs</button>
                </a>
                <Link
                  href="https://www.moesif.com"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <button className="button button--outline-secondary">
                    Go to Plans
                  </button>
                </Link>
              </>
            }
          />
          <p className="text-muted">
            For developers, if you want subscriptions to sync faster, you can
            locally cache the subscription in your system. In this example
            project, there is no local database or storage.
          </p>
        </>
      )}

      {subscriptions?.length > 0 && (
        <div>
          {subscriptions.map((sub) => (
            <SubDisplay sub={sub} key={sub.subscription_id} plans={plans} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default Subscription;
