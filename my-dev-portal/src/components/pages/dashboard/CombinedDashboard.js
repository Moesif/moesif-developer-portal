import { PageLayout } from "../../page-layout";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageLoader } from "../../page-loader";
import MoesifEmbeddedTemplate from "../../moesif/moesif-embedded-template";
import NoticeBox from "../../notice-box";
import dashIcon from "../../../images/icons/bar-chart.svg";
import useAuthCombined from "../../../hooks/useAuthCombined";

const CombinedDashboard = (props) => {
  const { user, isLoading, idToken } = useAuthCombined();

  const { fetchEmbedInfo } = props;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const checkout_session_id = searchParams.get("checkout-session");
  const [error, setError] = useState();
  const [iFrameSrcLiveEvent, setIFrameSrcLiveEvent] = useState();
  const [iFrameSrcTimeSeries, setIFrameSrcTimeSeries] = useState();

  useEffect(() => {
    if (checkout_session_id) {
      fetch(
        `${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/register/stripe/${checkout_session_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          fetchEmbedInfo({
            stripCustomerId: result.customer,
            authUserId: user?.id,
            setIFrameSrcLiveEvent,
            setIFrameSrcTimeSeries,
            setError,
          });
        })
        .catch((err) => {
          setError(err);
        });
    } else {
      fetch(
        `${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/stripe/customer?email=` +
          encodeURIComponent(user.email),
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      )
        .then((res) => res.json())
        .then((stripeCustomerObject) => {
          fetchEmbedInfo({
            stripeCustomerId: stripeCustomerObject?.id,
            authUserId: user?.id,
            setIFrameSrcLiveEvent,
            setIFrameSrcTimeSeries,
            setError,
          });
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [idToken, isLoading, navigate, checkout_session_id, user, fetchEmbedInfo]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <PageLayout>
      <h1>My Dashboards</h1>
      <p>
        Please see{" "}
        <a
          className="button__link"
          target="_blank"
          href="https://www.moesif.com/docs/embedded-templates/"
        >
          Moesif Embedded Metric
        </a>{" "}
        docs to for details regarding configuration,{" "}
        <a
          className="button__link"
          target="_blank"
          href="https://www.moesif.com/docs/embedded-templates/creating-and-using-templates/#display-options"
        >
          display options
        </a>
        , and setup instructions.
      </p>
      {!error && (
        <MoesifEmbeddedTemplate
          iFrameSrcLiveEvent={iFrameSrcLiveEvent}
          iFrameSrcTimeSeries={iFrameSrcTimeSeries}
          error={error}
        />
      )}
      {error && (
        <NoticeBox
          iconSrc={dashIcon}
          title={error.toString()}
          description={
            <p>
              Did you set up your environment variables correctly for embedded
              dashboard and charts?
            </p>
          }
          actions={
            <>
              <a
                target="_blank"
                href="https://www.moesif.com/docs/embedded-templates/"
              >
                <button className="button button__link">
                  Embedded Metric Docs
                </button>
              </a>
              <a
                target="_blank"
                href="https://www.moesif.com/docs/developer-portal/configuring-the-dashboard/"
              >
                <button className="button">Dev Portal Docs</button>
              </a>
            </>
          }
        />
      )}
    </PageLayout>
  );
};

export default CombinedDashboard;
