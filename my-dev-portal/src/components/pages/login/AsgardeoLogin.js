import React from "react";

import { PageLayout } from "../../page-layout";

import wfImage from "../../../images/assets/wf-diagram.png";
import { SignupButton } from "../../buttons/signup-button";
import { LoginButton } from "../../buttons/login-button";

function AsgardeoLogin() {
  return (
    <PageLayout>
      <div className="login-page">
        <h1>Welcome to Your Custom Dev Portal!</h1>
        <h2>
          <SignupButton isLink /> or <LoginButton isLink /> to get started.
        </h2>

        <div className="page-layout__focus">
          <img src={wfImage} width="100%" alt="flow-diagram" />
        </div>
      </div>
    </PageLayout>
  );
}

export default AsgardeoLogin;
