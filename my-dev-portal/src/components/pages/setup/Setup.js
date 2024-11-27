import React from "react";
import { PageLayout } from "../../page-layout";
import wfImage from "../../../images/assets/dev-portal-architecture-diagram.svg";

function Setup(props) {
  return (
    <PageLayout>
      <h1>Dev Portal Setup</h1>
      <p>
        For full instructions, see the README file in our <a href="https://github.com/Moesif/moesif-developer-portal">GitHub repo.</a><br></br>
        Reference the architecture diagram below for details.
      </p>
      <div className="page-layout__focus">
        <img src={wfImage} width="100%" alt="flow-diagram" />
      </div>
      <h2>Guide</h2>
      <div style={{ height: "50" }} />
    </PageLayout>
  );
}

export default Setup;
