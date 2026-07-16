import { PageLayout } from "../../page-layout";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PageLoader } from "../../page-loader";
import MoesifEmbeddedTemplate from "../../moesif/moesif-embedded-template";
import NoticeBox from "../../notice-box";
import SVG from "react-inlinesvg";
import dashIcon from "../../../images/icons/bar-chart.svg";
import useAuthCombined from "../../../hooks/useAuthCombined";
import { welcomeStorageKey } from "../../../common/constants";
import fetchEmbedChartUrls from "./fetchEmbedChartUrls";

const isNotProvisionedError = (error) =>
  error?.status === 400 || error?.status === 404;

const Dashboard = (props) => {
  const { user, isLoading, idToken, userEmail } = useAuthCombined();
  const navigate = useNavigate();

  const [error, setError] = useState();
  const [embedTemplateUrls, setEmbedTemplateUrls] = useState(null);

  const email = user?.email || userEmail;

  useEffect(() => {
    window?.moesif?.track('viewed-dashboard');

    if (idToken) {
      fetchEmbedChartUrls({
        authUserId: user?.user_id || user?.id || user?.sub,
        idToken,
        email,
      })
        .then((embedInfos) => {
          setEmbedTemplateUrls(embedInfos);
        })
        .catch((err) => {
          console.error("failed to load embed dash", err);
          setError(err);
        });
    }
  }, [idToken, user, email]);

  if (isLoading || !idToken || (!error && !embedTemplateUrls)) {
    return <PageLoader />;
  }

  if (user?.sub && !localStorage.getItem(welcomeStorageKey(user.sub))) {
    return <Navigate replace to="/welcome" />;
  }

  return (
    <PageLayout>
      <div className="page-heading">
        <p className="page-eyebrow">Usage</p>
        <h1>API activity</h1>
        <p>
          Track requests, records returned, attachment activity, and billing
          usage for your Open Opportunities API access.
        </p>
      </div>
      {!error && (
        <MoesifEmbeddedTemplate embedTemplateUrls={embedTemplateUrls || []} />
      )}
      {error && isNotProvisionedError(error) && (
        <div className="empty-state">
          <SVG src={dashIcon} aria-hidden="true" />
          <h2>Subscribe to unlock your dashboards</h2>
          <p>
            Usage analytics appear here once you have an active plan. Choose
            one to activate your API access.
          </p>
          <button
            className="button button--primary"
            onClick={() => navigate("/plans")}
          >
            View plans
          </button>
        </div>
      )}
      {error && !isNotProvisionedError(error) && (
        <NoticeBox
          iconSrc={dashIcon}
          title={error.message}
          description={
            <p>
              We could not load your usage dashboards yet. If you have just
              subscribed, try again shortly.
            </p>
          }
        />
      )}
    </PageLayout>
  );
};

export default Dashboard;
