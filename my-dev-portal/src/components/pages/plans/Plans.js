import React from "react";

import { PageLayout } from "../../page-layout";
import MoesifPlans from "./MoesifPlans";
import NoPriceFound from './NoPriceFound';

function Plans(props) {
  return (
    <PageLayout>
      <MoesifPlans skipExample />
      <NoPriceFound />
    </PageLayout>
  );
}

export default Plans;
