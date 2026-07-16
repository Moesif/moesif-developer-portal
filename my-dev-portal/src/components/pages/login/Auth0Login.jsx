import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { PageLayout } from "../../page-layout";
import { PageLoader } from "../../page-loader";

import { SignupButton } from "../../buttons/signup-button";
import { LoginButton } from "../../buttons/login-button";
import openOpportunitiesLogo from "../../../images/assets/open-opportunities-logo.png";

function Auth0Login() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <PageLayout>
      <div className="login-page">
        <div className="login-card">
          <div className="brand-lockup brand-lockup--body">
            <img src={openOpportunitiesLogo} alt="Open Opportunities" />
          </div>
          <div className="hero-kicker">Open Opportunities API</div>
          <h1>Developer Portal</h1>
          <p>
            Sign in to manage API keys, view usage, update billing, and choose
            the right access plan for your team.
          </p>
          <div className="login-card__actions">
            <SignupButton />
            <LoginButton />
          </div>
          <p className="login-card__hint">
            New customers can create an account and add a card before
            generating API access.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

export default Auth0Login;
