import React from "react";

function SinglePlan(props) {
  const { plan } = props;

  return (
    <div>
      <pre>{JSON.stringify(plan, null, "  ")}</pre>
    </div>
  );
}

export default SinglePlan;
