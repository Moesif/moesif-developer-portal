import React from "react";

import { PageLayout } from "../../page-layout";
import { PageLoader } from "../../page-loader";
import MoesifPlans from '../plans/MoesifPlans';
import { SignupButton } from '../../buttons/signup-button';
import { LoginButton } from '../../buttons/login-button';


function Home() {
  return (
    <PageLayout>
      <div className="login-page">
        <h1>Welcome to Your Custom Dev Portal!</h1>
        <h2>
          <SignupButton isLink /> or <LoginButton isLink /> to get started.
        </h2>
      </div>
      <MoesifPlans />
    </PageLayout>
  );
}

export default Home;
