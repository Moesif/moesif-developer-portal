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
            fetchEmbedInfo(result.customer, setIFrameSrcLiveEvent, setIFrameSrcTimeSeries, setError)
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
          (result) => { 
            fetchEmbedInfo(result.data[0].id, setIFrameSrcLiveEvent, setIFrameSrcTimeSeries, setError); 
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