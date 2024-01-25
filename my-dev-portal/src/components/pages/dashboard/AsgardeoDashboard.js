import { useAuthContext } from "@asgardeo/auth-react";
import { PageLayout } from "../../page-layout";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MoesifEmbeddedTemplate from "../../moesif/moesif-embedded-template";

const AsgardeoDashboard = (props) => {
  const { state } = useAuthContext();

    const { fetchEmbedInfo } = props;

    let userEmail = state.email || state.username;

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const checkout_session_id = searchParams.get("checkout-session");
    const [error, setError] = useState();
    const [iFrameSrcLiveEvent, setIFrameSrcLiveEvent] = useState();
    const [iFrameSrcTimeSeries, setIFrameSrcTimeSeries] = useState();

    useEffect(() => {
      if(checkout_session_id) {
        fetch(`${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/register/stripe/${checkout_session_id}`, {
          method: 'POST',
          headers: {
            // 'Authorization': should be the auth0 access token.
          }
        })
        .then(res => res.json())
        .then(
          (result) => {
            fetchEmbedInfo(result.customer, setIFrameSrcLiveEvent, setIFrameSrcTimeSeries, setError)
          }
        )
      }
      else {
        fetch(`${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/stripe/customer?email=` + encodeURIComponent(userEmail), {
          headers: {
            // 'Authorization': should be the auth0 access token when ready.
          }
        }).then(res => res.json())
        .then(
          (customer) => {
            if(customer.id !== undefined) {
              fetchEmbedInfo(customer.id, setIFrameSrcLiveEvent, setIFrameSrcTimeSeries, setError);
            }
            else {
              navigate('/product-select');
            }
          }
        );
      }
    }, [navigate, checkout_session_id, userEmail, fetchEmbedInfo]);

    return (
      <PageLayout>
        <>
          <MoesifEmbeddedTemplate iFrameSrcLiveEvent={iFrameSrcLiveEvent} iFrameSrcTimeSeries={iFrameSrcTimeSeries} error={error} />
        </>
      </PageLayout>
    );
  }

  export default AsgardeoDashboard;
