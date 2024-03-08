import React, { useState, useEffect } from "react";

import { PageLayout } from "../../page-layout";
import { PageLoader } from "../../page-loader";

import wfImage from "../../../images/assets/wf-diagram.png";
import { SignupButton } from "../../buttons/signup-button";
import { LoginButton } from "../../buttons/login-button";
import SinglePlan from "./SinglePlan";

function MoesifPlans(props) {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState(null);
  const [error, setError] = useState();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/plans`)
      .then((res) => res.json())
      .then((result) => {
        setPlans(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log("failed to load plans", err);
        setError(err);
      });
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <PageLayout>
      <div className="page-layout__focus">
        {!loading && !error && !plans && (
          <p>
            No Plans set up in Moesif. Please set create Plan in Moesif to
            stripe.
          </p>
        )}
        {plans && plans.map((item) => <SinglePlan plan={item} />)}
      </div>
    </PageLayout>
  );
}

export default MoesifPlans;
