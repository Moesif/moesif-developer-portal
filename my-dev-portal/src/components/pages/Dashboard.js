import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../page-layout";
import { useEffect, useState } from 'react';
import {
  useSearchParams
} from "react-router-dom";
import { PageLoader } from "../page-loader";
import MoesifEmbeddedTemplate from "../moesif/moesif-embedded-template";

export default function Dashboard() {
  const { user, isLoading } = useAuth0();
  const [searchParams] = useSearchParams();
  const checkout_session_id = searchParams.get("checkout-session");
  const [error, setError] = useState();
  const [iFrameSrcLiveEvent, setIFrameSrcLiveEvent] = useState();
  const [iFrameSrcTimeSeries, setIFrameSrcTimeSeries] = useState();
  
  useEffect(() => {
    if (isLoading) {
      return <PageLoader />;
    }
    
    if(checkout_session_id) {
      fetch(`https://api.stripe.com/v1/checkout/sessions/${checkout_session_id}`, {
        headers: {
          'Authorization': process.env.REACT_APP_STRIPE_AUTH_KEY
        }
      })
      .then(res => res.json())
      .then(
        (result) => {
          if(result.customer && result.subscription) {
            fetch(`${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/register`, {
              method: "POST",
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                email: result.customer_email,
                customer_id: result.customer,
                subscription_id: result.subscription
              })
            })
            .then(res => res.json())
            .then(
              (result) => { console.log(result); }
            );
          }
          fetchEmbedInfo(result.customer)
        }
      )
    }
    else {
      fetch(`https://api.stripe.com/v1/customers/search?query=${encodeURIComponent(`email:"${user.email}"`)}`, {
        headers: {
          'Authorization': process.env.REACT_APP_STRIPE_AUTH_KEY
        }
      }).then(res => res.json())
      .then(
        (result) => { fetchEmbedInfo(result.data[0].id); }
      );
    }
  }, [isLoading, checkout_session_id, user]);

  function fetchEmbedInfo(userId) {
    fetch(`${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/embed-dash-live-event/` + encodeURIComponent(userId))
      .then(function (response) {
        if (response.ok) {
          return response;
        } else {
          console.log(response.statusText);
          throw Error(response.statusText);
        }
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (body) {
        setIFrameSrcLiveEvent( body ? body.url : "");
      })
      .catch(function (err) {
        setError("Could not load charts");
      });

      fetch(`${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/embed-dash-time-series/` + encodeURIComponent(userId))
      .then(function (response) {
        if (response.ok) {
          return response;
        } else {
          console.log(response.statusText);
          throw Error(response.statusText);
        }
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (body) {
        setIFrameSrcTimeSeries( body ? body.url : "");
      })
      .catch(function (err) {
        setError("Could not load. Please check if you created .env with MOESIF_MANAGEMENT_TOKEN && MOESIF_TEMPLATE_WORKSPACE_ID and run `node server.js`.");
      });
  }

  return (
    <PageLayout>
      <>
        <MoesifEmbeddedTemplate iFrameSrcLiveEvent={iFrameSrcLiveEvent} iFrameSrcTimeSeries={iFrameSrcTimeSeries} error={error} />
      </>
    </PageLayout>
  );
}