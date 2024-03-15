import React, { useState, useEffect } from "react";
import { PageLayout } from "../../page-layout";
import wfImage from "../../../images/assets/wf-diagram.png";

function Setup(props) {
  return (
    <PageLayout>
      <h1>Welcome to Starting Project</h1>
      <p>instructions for </p>
      <div className="page-layout__focus">
        <img src={wfImage} width="100%" alt="flow-diagram" />
      </div>
    </PageLayout>
  );
}

export default Setup;
