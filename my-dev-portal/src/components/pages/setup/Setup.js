import React, { useState, useEffect } from "react";
import { PageLayout } from "../../page-layout";
import wfImage from "../../../images/assets/wf-diagram.png";

function Setup(props) {
  return (
    <PageLayout>
      <h1>Welcome to Starting Project</h1>
      <p>
        Below is an architectural diagram of how is Developer Portal ties
        together various system to delivery a complete solution.
      </p>
      <div className="page-layout__focus">
        <img src={wfImage} width="100%" alt="flow-diagram" />
      </div>
      <h2>Guide</h2>
      <p>
        For for instruction please see{" "}
        <a href="https://github.com/Moesif/moesif-developer-portal">
          README and our github repo.
        </a>
      </p>
    </PageLayout>
  );
}

export default Setup;
