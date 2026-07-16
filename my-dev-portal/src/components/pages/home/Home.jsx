import React from "react";
import { Navigate } from "react-router-dom";

import { PageLayout } from "../../page-layout";
import { SignupButton } from "../../buttons/signup-button";
import { LoginButton } from "../../buttons/login-button";
import openOpportunitiesLogo from "../../../images/assets/open-opportunities-logo.png";
import { PageLoader } from "../../page-loader";
import useAuthCombined from "../../../hooks/useAuthCombined";

function Home() {
  const { isAuthenticated, isLoading } = useAuthCombined();

  if (isLoading) return <PageLoader />;
  if (isAuthenticated) return <Navigate replace to="/dashboard" />;

  return (
    <PageLayout isHome>
      <section className="hero">
        <div className="hero-content">
          <div className="brand-lockup brand-lockup--body">
            <img src={openOpportunitiesLogo} alt="Open Opportunities" />
          </div>
          <div className="hero-kicker">Open Opportunities API</div>
          <h1>Developer Portal</h1>
          <p>
            Create API access, choose a usage plan, and track procurement data
            usage from one place.
          </p>

          <div className="buttons">
            <LoginButton isLink />
            <SignupButton />
          </div>
        </div>
        <div className="hero-panel" aria-label="Open Opportunities API workflow">
          <div className="hero-panel__eyebrow">Daily procurement data</div>
          <div className="hero-panel__title">900+ sources to JSON</div>
          <div className="hero-panel__metrics">
            <div>
              <strong>180+</strong>
              <span>countries monitored</span>
            </div>
            <div>
              <strong>900+</strong>
              <span>source portals checked</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>usage and billing visibility</span>
            </div>
          </div>
          <p>
            Start with a plan, generate access, and keep track of consumption
            as your team searches procurement opportunities.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}

export default Home;
