import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../../page-layout";
import { useEffect, useState } from 'react';
import {
  useNavigate,
  useSearchParams
} from "react-router-dom";
import { PageLoader } from "../../page-loader";
import MoesifEmbeddedTemplate from "../../moesif/moesif-embedded-template";

const Auth0Dashboard = (props) => {
    const { user: auth0User, isLoading: auth0IsLoading } = useAuth0();

    const { fetchEmbedInfo } = props;

    let isLoading = auth0IsLoading;
    let user = auth0User;

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const checkout_session_id = searchParams.get("checkout-session");
    const [error, setError] = useState();
    const [iFrameSrcLiveEvent, setIFrameSrcLiveEvent] = useState();
    const [iFrameSrcTimeSeries, setIFrameSrcTimeSeries] = useState();

    useEffect(() => {
      if (isLoading) {
        return <PageLoader />;
      }

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
        fetch(`${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/stripe/customer?email=${user.email}`, {
          headers: {
            // 'Authorization': should be the auth0 access token when ready.
          }
        }).then(res => res.json())
        .then(
          (customer) => {
            fetchEmbedInfo(customer.id, setIFrameSrcLiveEvent, setIFrameSrcTimeSeries, setError);
          }
        );
      }
    }, [isLoading, navigate, checkout_session_id, user, fetchEmbedInfo]);

    return (
      <PageLayout>
        <>
          <MoesifEmbeddedTemplate iFrameSrcLiveEvent={iFrameSrcLiveEvent} iFrameSrcTimeSeries={iFrameSrcTimeSeries} error={error} />
        </>
      </PageLayout>
    );
  }

  export default Auth0Dashboard
