import React from "react";

import { PageLayout } from "../../page-layout";
import MoesifPlans from "./MoesifPlans";
import { PageFooter } from '../../page-footer';

function Plans(props) {
  return (
    <>
    <PageLayout>
      <MoesifPlans skipTitle/>
    </PageLayout>
    <PageFooter />
    </>
  );
}

export default Plans;
