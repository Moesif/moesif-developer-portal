import React from "react";

import { PageLayout } from "../../page-layout";
import { PageLoader } from "../../page-loader";
import MoesifPlans from "../plans/MoesifPlans";
import { SignupButton } from "../../buttons/signup-button";
import { LoginButton } from "../../buttons/login-button";
import { Link } from "react-router-dom";
import heroImage from "../../../images/assets/hero-image.png";

function Home() {
  return (
    <PageLayout>
      <section className="hero">
        <div className="hero-content">
          <h1>MyDev Portal!</h1>
          <p>
            Welcome to your custom developer portal. Prompt customers to the
            links below.
          </p>

          <div className="buttons">
            <SignupButton isLink />
            <LoginButton isLink />
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="flow-diagram" />
        </div>
      </section>
      <hr />
      <MoesifPlans />
      <hr />
      <h3>
        For Developer please See Read me of the repo
        https://github.com/Moesif/moesif-developer-portal for set up
        instructions. Or see <Link to="/setup">Set up</Link> page
      </h3>
      <div style={{ height: "50" }} />
    </PageLayout>
  );
}

export default Home;
