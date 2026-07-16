import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { PageLayout } from "../../page-layout";
import useAuthCombined from "../../../hooks/useAuthCombined";
import { welcomeStorageKey } from "../../../common/constants";

const API_DOCS_URL =
  "https://docs.openopps.com/s/1e0ae5a0-98cd-4814-9a10-08fef3ce3c4b/doc/api-v30-documentation-v2-summary-records-P5dS1Xsr1g";

function Welcome() {
  const { user } = useAuthCombined();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.sub) {
      localStorage.setItem(
        welcomeStorageKey(user.sub),
        new Date().toISOString()
      );
    }
  }, [user]);

  return (
    <PageLayout>
      <section className="welcome-page">
        <div className="page-heading">
          <p className="page-eyebrow">Welcome</p>
          <h1>Welcome to the Open Opportunities API</h1>
          <p>
            Procurement data from 900+ sources across 180+ countries, served
            as clean JSON. Three steps and you are up and running.
          </p>
        </div>

        <div className="welcome-steps">
          <article className="welcome-step">
            <span className="welcome-step__number" aria-hidden="true">1</span>
            <h2>Choose a plan</h2>
            <p>
              Pick the usage tier that fits your needs. Basic starts with no
              upfront commitment, so you can begin small and grow.
            </p>
            <button
              className="button__link welcome-step__link"
              onClick={() => navigate("/plans")}
            >
              View plans
            </button>
          </article>

          <article className="welcome-step">
            <span className="welcome-step__number" aria-hidden="true">2</span>
            <h2>Create an API key</h2>
            <p>
              Generate a key from the API keys page and store it safely. The
              secret is shown once, and you can rotate it any time.
            </p>
            <button
              className="button__link welcome-step__link"
              onClick={() => navigate("/keys")}
            >
              Manage API keys
            </button>
          </article>

          <article className="welcome-step">
            <span className="welcome-step__number" aria-hidden="true">3</span>
            <h2>Make your first call</h2>
            <p>
              Send requests with your key in the X-API-Key header, then track
              usage and spend from your dashboard.
            </p>
            <a
              className="welcome-step__link"
              href={API_DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the API docs
            </a>
          </article>
        </div>

        <div className="welcome-actions">
          <button
            className="button button--primary"
            onClick={() => navigate("/plans")}
          >
            Choose a plan
          </button>
          <button
            className="button button--outline-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Go to my dashboard
          </button>
        </div>
      </section>
    </PageLayout>
  );
}

export default Welcome;
