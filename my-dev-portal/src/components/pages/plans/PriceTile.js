import React from "react";
import isNil from "lodash/isNil";
import { Link } from "react-router-dom";
import CommonTable from "../../common-table";

export const examplePlansFromStripe = {
  hits: [
    {
      provider: "stripe",
      id: "prod_Pvpfu5ruvsyvlU",
      name: "Daily Prepaid",
      status: "archived",
      metadata: {},
      created_at: "2024-04-15T22:27:39.000",
      updated_at: "2024-11-21T07:09:06.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1P5y01FM2Whj9NlnBunOPSEC",
          status: "active",
          currency: "USD",
          metadata: {},
          plan_id: "prod_Pvpfu5ruvsyvlU",
          period: 1,
          period_units: "d",
          usage_aggregator: "sum",
          price_in_decimal: "1.02",
          pricing_model: "per_unit",
          created_at: "2024-04-15T22:27:41.000",
          tax_behavior: "unspecified",
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_P6Pj41BeQlrJkJ",
      name: "Pro Plan",
      status: "archived",
      metadata: {},
      created_at: "2023-11-30T16:15:29.000",
      updated_at: "2024-11-21T07:08:34.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1QIcSGFM2Whj9Nln1KWUsWdQ",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "Tiered Price",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2024-11-07T20:37:24.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1,
              unit_price_in_decimal: "0.5",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 1000,
              unit_price_in_decimal: "0.025",
              flat_price_in_decimal: "0",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0.01",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1QHrreFM2Whj9Nln5mUxEOta",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My Tiered Price",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2024-11-05T18:52:30.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 2,
              unit_price_in_decimal: "0.1",
              flat_price_in_decimal: "0",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0.05",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1QD7RmFM2Whj9NlnoM20idKf",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My pricing tier",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2024-10-23T16:30:10.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1000,
              unit_price_in_decimal: "0.05",
              flat_price_in_decimal: "0",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0.025",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1QCoq6FM2Whj9NlnyjwDd9GO",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My Volume Price",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2024-10-22T20:38:02.000",
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
        {
          provider: "stripe",
          id: "price_1Q8PmqFM2Whj9NlnCP45C2CV",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "Volume Price",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2024-10-10T17:04:28.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 100000,
              unit_price_in_decimal: "0.05",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 1000000,
              unit_price_in_decimal: "0.025",
              flat_price_in_decimal: "0",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0.01",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1Q7QN6FM2Whj9NlnN4YqO8FW",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My Tiered Price",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2024-10-07T23:29:48.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 10000,
              unit_price_in_decimal: "0.05",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 1000000,
              unit_price_in_decimal: "0.025",
              flat_price_in_decimal: "0",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0.01",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1Q0NySFM2Whj9NlnHXZK5lkz",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "Tiered Price",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2024-09-18T13:31:16.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 10000,
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
        {
          provider: "stripe",
          id: "price_1Pvf63FM2Whj9Nlng23SWnLG",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My Usage Based Tiers",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2024-09-05T12:47:35.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1000,
              unit_price_in_decimal: "0.1",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 10000,
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
        {
          provider: "stripe",
          id: "price_1PqiQfFM2Whj9Nln6RPosCNC",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My Tiered Price",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2024-08-22T21:20:25.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 10000,
              unit_price_in_decimal: "0.5",
              flat_price_in_decimal: "0",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0.25",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1PqIIhFM2Whj9NlnnXngQ6B7",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My Tiered Price",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2024-08-21T17:26:27.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1000,
              unit_price_in_decimal: "0.05",
              flat_price_in_decimal: "0",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0.025",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1Pj25WFM2Whj9NlnTfO5bDBT",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My Tiered API Price",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2024-08-01T16:42:50.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 10000,
              unit_price_in_decimal: "0.05",
              flat_price_in_decimal: "0",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0.025",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1Pb71wFM2Whj9NlnE7zHus7X",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My Tiered Price",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "tiered",
          created_at: "2024-07-10T20:22:24.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 100000,
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
        {
          provider: "stripe",
          id: "price_1PXojyFM2Whj9NlnmN1t82qa",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My Tiered Price",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "tiered",
          created_at: "2024-07-01T18:14:14.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 10000,
              unit_price_in_decimal: "0.05",
              flat_price_in_decimal: "0",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0.025",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1PW4EfFM2Whj9Nlno5kr6T78",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My Tiered Price",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "tiered",
          created_at: "2024-06-26T22:22:41.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 10000,
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
        {
          provider: "stripe",
          id: "price_1PVfJwFM2Whj9Nlnd9H74ixD",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "tiered pro plan",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "tiered",
          created_at: "2024-06-25T19:46:28.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 10000,
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
        {
          provider: "stripe",
          id: "price_1PVeeVFM2Whj9Nlnkt0Yp4TZ",
          status: "active",
          currency: "USD",
          metadata: {},
          name: ".01 per 1k",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "0.01",
          pricing_model: "per_unit",
          created_at: "2024-06-25T19:03:39.000",
          tax_behavior: "unspecified",
          transform_quantity: {
            divide_by: 1000,
            round: "up",
          },
        },
        {
          provider: "stripe",
          id: "price_1PVbFRFM2Whj9NlnsIZPpNMp",
          status: "active",
          currency: "USD",
          metadata: {},
          name: ".01 per 1k units",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "0.01",
          pricing_model: "per_unit",
          created_at: "2024-06-25T15:25:33.000",
          tax_behavior: "unspecified",
          transform_quantity: {
            divide_by: 1000,
            round: "up",
          },
        },
        {
          provider: "stripe",
          id: "price_1PToaIFM2Whj9NlnT6q5kOUS",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My Tiered Pro Price",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "tiered",
          created_at: "2024-06-20T17:15:42.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 100000,
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
        {
          provider: "stripe",
          id: "price_1OICu7FM2Whj9Nln6bdXUUQZ",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "$.01 per API Call",
          plan_id: "prod_P6Pj41BeQlrJkJ",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "1000",
          pricing_model: "per_unit",
          created_at: "2023-11-30T16:15:55.000",
          tax_behavior: "unspecified",
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_P5tRzgbaVNszZe",
      name: "test",
      status: "archived",
      metadata: {},
      unit: "My Seat $v2",
      created_at: "2023-11-29T06:54:08.000",
      updated_at: "2023-11-29T06:54:23.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1OKmaAFM2Whj9NlnrFK1WcRH",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "AA",
          plan_id: "prod_P5tRzgbaVNszZe",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "1",
          pricing_model: "per_unit",
          created_at: "2023-12-07T18:45:58.000",
          tax_behavior: "unspecified",
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_P5gwEzefT8HLsx",
      name: "Pro Plan",
      status: "active",
      metadata: {},
      unit: "Pro API",
      created_at: "2023-11-28T17:58:55.000",
      updated_at: "2023-11-28T17:58:55.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1OgwwVFM2Whj9NlngWvXPChV",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "Test",
          plan_id: "prod_P5gwEzefT8HLsx",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "1",
          pricing_model: "per_unit",
          created_at: "2024-02-06T22:16:39.000",
          tax_behavior: "unspecified",
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_P5g7FC57j7cO4M",
      name: "My Pro API",
      status: "active",
      metadata: {},
      created_at: "2023-11-28T17:07:22.000",
      updated_at: "2023-11-28T17:07:22.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1PgCokFM2Whj9Nln1m3nIWVN",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My Tiered Price",
          plan_id: "prod_P5g7FC57j7cO4M",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2024-07-24T21:33:50.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1000,
              unit_price_in_decimal: "0.05",
              flat_price_in_decimal: "0",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0.04",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1PdciMFM2Whj9NlnXoBYZucH",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My Tiered Price",
          plan_id: "prod_P5g7FC57j7cO4M",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2024-07-17T18:36:34.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 10000,
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
        {
          provider: "stripe",
          id: "price_1PSkDBFM2Whj9Nln6nKqDwpv",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My Per .01 per unit price",
          plan_id: "prod_P5g7FC57j7cO4M",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "tiered",
          created_at: "2024-06-17T18:23:25.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0.01",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1OHUlzFM2Whj9NlnQDkTJjzA",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "$0.01 per API Call",
          plan_id: "prod_P5g7FC57j7cO4M",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "tiered",
          created_at: "2023-11-28T17:08:35.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 10000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0.01",
              flat_price_in_decimal: "0",
            },
          ],
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_P1CAuyXy42FQxa",
      name: "Usage Pricing",
      status: "archived",
      metadata: {},
      created_at: "2023-11-16T17:54:58.000",
      updated_at: "2024-11-21T07:09:37.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1OD9mJFM2Whj9NlnGFhkcLvs",
          status: "active",
          currency: "USD",
          metadata: {},
          plan_id: "prod_P1CAuyXy42FQxa",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "3.5",
          pricing_model: "per_unit",
          created_at: "2023-11-16T17:54:59.000",
          tax_behavior: "unspecified",
          transform_quantity: {
            divide_by: 1000,
            round: "up",
          },
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_OnrcW7LmwKtHuS",
      name: "Volume - With Flat LKV per Period",
      status: "active",
      metadata: {},
      created_at: "2023-10-12T03:48:37.000",
      updated_at: "2023-10-12T03:48:38.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1O4QNUFM2Whj9NlnRTZphZv0",
          status: "archived",
          currency: "USD",
          metadata: {},
          name: "asdfwe",
          plan_id: "prod_OnrcW7LmwKtHuS",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          pricing_model: "volume",
          created_at: "2023-10-23T15:49:16.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 1,
              unit_price_in_decimal: "1",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "2",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1O0Ft3FM2Whj9Nln3rwr8Y62",
          status: "active",
          currency: "USD",
          metadata: {},
          plan_id: "prod_OnrcW7LmwKtHuS",
          period: 1,
          period_units: "M",
          usage_aggregator: "last_during_period",
          pricing_model: "volume",
          created_at: "2023-10-12T03:48:37.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 10000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "10000",
            },
            {
              up_to: 20000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "20000",
            },
            {
              up_to: 30000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "30000",
            },
            {
              up_to: 40000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "40000",
            },
            {
              up_to: 50000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "50000",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1O0Ft3FM2Whj9NlnsTwpqhTl",
          status: "active",
          currency: "USD",
          metadata: {},
          plan_id: "prod_OnrcW7LmwKtHuS",
          period: 1,
          period_units: "M",
          usage_aggregator: null,
          price_in_decimal: "10000",
          pricing_model: "flat",
          created_at: "2023-10-12T03:48:37.000",
          tax_behavior: "unspecified",
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_OnrViGmytaPqk5",
      name: "Volume - With Flat MAX",
      status: "active",
      metadata: {},
      created_at: "2023-10-12T03:41:41.000",
      updated_at: "2023-10-12T03:41:42.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1O0FmLFM2Whj9Nlnm6AxCioc",
          status: "active",
          currency: "USD",
          metadata: {},
          plan_id: "prod_OnrViGmytaPqk5",
          period: 1,
          period_units: "M",
          usage_aggregator: "max",
          pricing_model: "volume",
          created_at: "2023-10-12T03:41:41.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 10000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 20000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "10000",
            },
            {
              up_to: 30000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "20000",
            },
            {
              up_to: 40000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "30000",
            },
            {
              up_to: 50000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "40000",
            },
            {
              up_to: 60000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "50000",
            },
            {
              up_to: 70000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "60000",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1O0FmLFM2Whj9NlnUAqMa0hB",
          status: "active",
          currency: "USD",
          metadata: {},
          plan_id: "prod_OnrViGmytaPqk5",
          period: 1,
          period_units: "M",
          usage_aggregator: null,
          price_in_decimal: "10000",
          pricing_model: "flat",
          created_at: "2023-10-12T03:41:41.000",
          tax_behavior: "unspecified",
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_OnrUIU3Myqh5JO",
      name: "Volume - With Flat LKV",
      status: "active",
      metadata: {},
      created_at: "2023-10-12T03:40:30.000",
      updated_at: "2023-10-12T03:40:30.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1O0FlCFM2Whj9NlndbOPb4wq",
          status: "active",
          currency: "USD",
          metadata: {},
          plan_id: "prod_OnrUIU3Myqh5JO",
          period: 1,
          period_units: "M",
          usage_aggregator: "last_ever",
          pricing_model: "volume",
          created_at: "2023-10-12T03:40:30.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 10000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 20000,
              flat_price_in_decimal: "10000",
            },
            {
              up_to: 30000,
              flat_price_in_decimal: "20000",
            },
            {
              up_to: 40000,
              flat_price_in_decimal: "30000",
            },
            {
              up_to: 50000,
              flat_price_in_decimal: "40000",
            },
            {
              up_to: 60000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "50000",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1O0FlCFM2Whj9Nln7sLP2QWm",
          status: "active",
          currency: "USD",
          metadata: {},
          plan_id: "prod_OnrUIU3Myqh5JO",
          period: 1,
          period_units: "M",
          usage_aggregator: null,
          price_in_decimal: "10000",
          pricing_model: "flat",
          created_at: "2023-10-12T03:40:30.000",
          tax_behavior: "unspecified",
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_OnpMU0k5fNBpbS",
      name: "Most Recent Value",
      status: "archived",
      metadata: {},
      created_at: "2023-10-12T01:28:38.000",
      updated_at: "2024-11-21T07:09:27.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1O0DhaFM2Whj9NlnqWWzNfpC",
          status: "active",
          currency: "USD",
          metadata: {},
          plan_id: "prod_OnpMU0k5fNBpbS",
          period: 1,
          period_units: "M",
          usage_aggregator: "last_ever",
          pricing_model: "volume",
          created_at: "2023-10-12T01:28:38.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 20000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 30000,
              flat_price_in_decimal: "10000",
            },
            {
              up_to: 40000,
              flat_price_in_decimal: "10000",
            },
            {
              up_to: 50000,
              flat_price_in_decimal: "10000",
            },
            {
              up_to: 60000,
              flat_price_in_decimal: "10000",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1O0DhaFM2Whj9NlnupXd9wGQ",
          status: "active",
          currency: "USD",
          metadata: {},
          plan_id: "prod_OnpMU0k5fNBpbS",
          period: 1,
          period_units: "M",
          usage_aggregator: null,
          price_in_decimal: "10000",
          pricing_model: "flat",
          created_at: "2023-10-12T01:28:38.000",
          tax_behavior: "unspecified",
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_OnourBU5AUj7In",
      name: "Flat and Tiered",
      status: "archived",
      metadata: {},
      created_at: "2023-10-12T01:00:53.000",
      updated_at: "2024-11-21T07:09:31.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1O0DGjFM2Whj9NlnaJiUo5h8",
          status: "active",
          currency: "USD",
          metadata: {},
          plan_id: "prod_OnourBU5AUj7In",
          period: 1,
          period_units: "M",
          usage_aggregator: "max",
          pricing_model: "volume",
          created_at: "2023-10-12T01:00:53.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 10000,
              unit_price_in_decimal: "0",
              flat_price_in_decimal: "0",
            },
            {
              up_to: 20000,
              flat_price_in_decimal: "10000",
            },
            {
              up_to: 30000,
              flat_price_in_decimal: "10000",
            },
            {
              up_to: 40000,
              flat_price_in_decimal: "10000",
            },
            {
              up_to: 50000,
              flat_price_in_decimal: "10000",
            },
            {
              up_to: 60000,
              flat_price_in_decimal: "10000",
            },
            {
              up_to: 70000,
              flat_price_in_decimal: "10000",
            },
            {
              up_to: 80000,
              flat_price_in_decimal: "10000",
            },
            {
              up_to: 90000,
              flat_price_in_decimal: "10000",
            },
            {
              up_to: "inf",
              unit_price_in_decimal: "0",
            },
          ],
        },
        {
          provider: "stripe",
          id: "price_1O0DGjFM2Whj9NlnoCnOu3dV",
          status: "active",
          currency: "USD",
          metadata: {},
          plan_id: "prod_OnourBU5AUj7In",
          period: 1,
          period_units: "M",
          usage_aggregator: null,
          price_in_decimal: "10000",
          pricing_model: "flat",
          created_at: "2023-10-12T01:00:53.000",
          tax_behavior: "unspecified",
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_OnoUgt0DOtjWxv",
      name: "Unique ESigns - Package",
      status: "active",
      metadata: {},
      created_at: "2023-10-12T00:35:13.000",
      updated_at: "2023-10-12T00:35:14.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1Ouh7YFM2Whj9NlniArNYqOs",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "Test Price",
          plan_id: "prod_OnoUgt0DOtjWxv",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "1",
          pricing_model: "per_unit",
          created_at: "2024-03-15T20:12:52.000",
          tax_behavior: "unspecified",
        },
        {
          provider: "stripe",
          id: "price_1O0CrtFM2Whj9NlnZErEIjdO",
          status: "active",
          currency: "USD",
          metadata: {},
          plan_id: "prod_OnoUgt0DOtjWxv",
          period: 1,
          period_units: "M",
          usage_aggregator: "max",
          price_in_decimal: "10000",
          pricing_model: "per_unit",
          created_at: "2023-10-12T00:35:13.000",
          tax_behavior: "unspecified",
          transform_quantity: {
            divide_by: 10000,
            round: "up",
          },
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_Ono42ZgEIuKDxp",
      name: "Unique - Tiers",
      status: "active",
      metadata: {},
      created_at: "2023-10-12T00:08:56.000",
      updated_at: "2023-10-12T00:16:40.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1O0CSSFM2Whj9NlnsUg8DUf7",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "Tiered Pricing",
          plan_id: "prod_Ono42ZgEIuKDxp",
          period: 1,
          period_units: "M",
          usage_aggregator: "max",
          pricing_model: "tiered",
          created_at: "2023-10-12T00:08:56.000",
          tax_behavior: "unspecified",
          tiers: [
            {
              up_to: 10000,
              flat_price_in_decimal: "10000",
            },
            {
              up_to: 20000,
              flat_price_in_decimal: "20000",
            },
            {
              up_to: 30000,
              flat_price_in_decimal: "30000",
            },
            {
              up_to: 40000,
              flat_price_in_decimal: "40000",
            },
            {
              up_to: 50000,
              flat_price_in_decimal: "50000",
            },
            {
              up_to: 60000,
              flat_price_in_decimal: "60000",
            },
            {
              up_to: 70000,
              flat_price_in_decimal: "70000",
            },
            {
              up_to: 80000,
              flat_price_in_decimal: "80000",
            },
            {
              up_to: 90000,
              flat_price_in_decimal: "90000",
            },
            {
              up_to: 100000,
              flat_price_in_decimal: "100000",
            },
            {
              up_to: "inf",
              flat_price_in_decimal: "150000",
            },
          ],
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_OnLL3KTnxzCSlm",
      name: "Unique E-Signs",
      status: "archived",
      metadata: {},
      created_at: "2023-10-10T18:28:03.000",
      updated_at: "2024-11-21T07:09:48.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1PK0RWFM2Whj9NlngVKosLRI",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "My new price",
          plan_id: "prod_OnLL3KTnxzCSlm",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "0.01",
          pricing_model: "per_unit",
          created_at: "2024-05-24T15:54:06.000",
          tax_behavior: "unspecified",
          transform_quantity: {
            divide_by: 1000,
            round: "up",
          },
        },
        {
          provider: "stripe",
          id: "price_1Nzo7vFM2Whj9Nln0PENxchC",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "Per 5",
          plan_id: "prod_OnLL3KTnxzCSlm",
          period: 1,
          period_units: "M",
          usage_aggregator: "max",
          price_in_decimal: "100",
          pricing_model: "per_unit",
          created_at: "2023-10-10T22:10:07.000",
          tax_behavior: "unspecified",
          transform_quantity: {
            divide_by: 5,
            round: "up",
          },
        },
        {
          provider: "stripe",
          id: "price_1Nzkf2FM2Whj9Nln8Q8JRqQd",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "$100 per 10k",
          plan_id: "prod_OnLL3KTnxzCSlm",
          period: 1,
          period_units: "M",
          usage_aggregator: "max",
          price_in_decimal: "100",
          pricing_model: "per_unit",
          created_at: "2023-10-10T18:28:04.000",
          tax_behavior: "unspecified",
          transform_quantity: {
            divide_by: 10000,
            round: "up",
          },
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_ONc1bX5pl1REjX",
      name: "Event volume",
      status: "active",
      metadata: {},
      created_at: "2023-08-03T01:57:37.000",
      updated_at: "2023-08-03T01:57:38.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1NaqnGFM2Whj9Nlnn9RN19wH",
          status: "active",
          currency: "USD",
          metadata: {},
          plan_id: "prod_ONc1bX5pl1REjX",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "0.001",
          pricing_model: "per_unit",
          created_at: "2023-08-03T01:57:38.000",
          tax_behavior: "unspecified",
        },
      ],
    },
    {
      provider: "stripe",
      id: "prod_ONCjqbqF720nka",
      name: "E-sign requests",
      status: "archived",
      metadata: {},
      created_at: "2023-08-01T23:50:16.000",
      updated_at: "2024-11-21T07:09:44.000",
      prices: [
        {
          provider: "stripe",
          id: "price_1NaSKSFM2Whj9Nln97QixAVH",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "Pro ($3 per 1k)",
          plan_id: "prod_ONCjqbqF720nka",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "3",
          pricing_model: "per_unit",
          created_at: "2023-08-01T23:50:16.000",
          tax_behavior: "unspecified",
          transform_quantity: {
            divide_by: 1000,
            round: "up",
          },
        },
        {
          provider: "stripe",
          id: "price_1NaSKSFM2Whj9Nlnq0Z1PY3t",
          status: "active",
          currency: "USD",
          metadata: {},
          name: "Starter ($1 per 1k)",
          plan_id: "prod_ONCjqbqF720nka",
          period: 1,
          period_units: "M",
          usage_aggregator: "sum",
          price_in_decimal: "1",
          pricing_model: "per_unit",
          created_at: "2023-08-01T23:50:16.000",
          tax_behavior: "unspecified",
          transform_quantity: {
            divide_by: 1000,
            round: "up",
          },
        },
      ],
    },
  ],
  failures: [],
};

function formatPrice(priceInDecimal = 0) {
  if (isNil(priceInDecimal)) {
    return "";
  }

  const priceInDollars = Number(priceInDecimal) / 100;

  // Format the price as a currency string with up to 10 decimal places
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0, // Minimum number of decimal places
    maximumFractionDigits: 10, // Maximum number of decimal places
  }).format(priceInDollars);
}

function formatPeriod(periodUnits, period) {
  switch (periodUnits) {
    case "y":
      return "yearly";
    case "d":
      return "daily";
    case "M":
    default:
      return "Monthly";
  }
}

function formatNumberToHuman(input) {
  // Handle "inf" case
  if (input === "inf") {
    return "∞"; // Unicode infinity symbol
  }

  // Convert the input to a number
  const num = parseFloat(input);

  // Define the thresholds for the human-readable format
  const thresholds = [
    { value: 1000000, suffix: "M" },
    { value: 1000, suffix: "K" },
  ];

  // Find the appropriate threshold and format the number
  for (const { value, suffix } of thresholds) {
    if (num >= value) {
      return `${(num / value).toFixed(1)}${suffix}`;
    }
  }

  // If no threshold is met, return the original number
  return num.toString();
}

function TierTable(props) {
  const { tiers } = props;

  const exampleTiers = [
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
  ];

  const haveFlatFee = tiers.some((item) => !!item.flat_price_in_decimal);
  const haveUnitPrice = tiers.some((item) => !!item.unit_price_in_decimal);

  const haveBoth = haveFlatFee && haveUnitPrice;

  const data = tiers;

  let columns = [
    {
      header: "Units",
      accessor: "up_to",
      cell: ({ index, value, row }) => {
        return (
          <span>
            {data[index - 1]?.up_to
              ? formatNumberToHuman(data[index - 1]?.up_to)
              : 1}
            {" - "}
            {formatNumberToHuman(value)}
          </span>
        );
      },
      justifyContent: "flex-start",
    },
    {
      header: "",
      accessor: "id",
      cell: ({ index }) => <span className="tier-arrow">→</span>,
      width: "15px",
      justifyContent: "center",
    },
  ];

  if (haveBoth) {
    columns = [
      ...columns,
      {
        header: "/Unit",
        accessor: "unit_price_in_decimal",
        cell: ({ index, value, row }) => {
          return formatPrice(value);
        },
        justifyContent: "flex-end",
      },
      {
        header: "",
        accessor: "plus",
        cell: () => <span>{"+"}</span>,
        width: "15px",
        justifyContent: "flex-end",
      },
      {
        header: <span>Flat Fee</span>,
        accessor: "flat_price_in_decimal",
        cell: ({ index, value, row }) => {
          return formatPrice(value);
        },
        justifyContent: "flex-end",
      },
    ];
  } else if (haveFlatFee) {
    columns = [
      ...columns,
      {
        header: <span>Flat Fee</span>,
        accessor: "flat_price_in_decimal",
        cell: ({ index, value, row }) => {
          return formatPrice(value);
        },
        justifyContent: "flex-end",
      },
    ];
  } else if (haveUnitPrice) {
    columns = [
      ...columns,
      {
        header: "/Unit",
        accessor: "unit_price_in_decimal",
        cell: ({ index, value, row }) => {
          return formatPrice(value);
        },
        justifyContent: "flex-end",
      },
    ];
  }

  return <CommonTable className="tier-table" data={tiers} columns={columns} />;
}

function PriceTile(props) {
  const { price, plan, actionButton, onSelection } = props;

  return (
    <div className="plan--single">
      <div className="plan--content">
        <div>{price.name || plan?.name || "Place Holder Plan"}</div>
        {price.tiers ? (
          <TierTable tiers={price.tiers} />
        ) : (
          <div>
            {formatPrice(price.price_in_decimal)}/{plan?.unit || "unit"}
          </div>
        )}
      </div>
      <div className="plan--action">
        <div>{formatPeriod(price.period_units, price.period)}</div>
        {actionButton}
      </div>
    </div>
  );
}

export default PriceTile;
