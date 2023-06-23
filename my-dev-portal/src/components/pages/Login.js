import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';

import { PageLayout } from "../page-layout";
import { PageLoader } from "../page-loader";

function LoginWithOkta() {
  const { authState } = useOktaAuth();
  const navigate = useNavigate();

  if (authState?.isAuthenticated) {
    navigate('/dashboard');
  }
  if (authState?.isPending) {
    return <PageLoader />;
  }

  return (
    <PageLayout>
      <>
        <h1 className="white-text">Welcome to Your Custom Dev Portal!</h1>
        <h3 className="white-text">Sign up or Log in to get started.</h3>
      </>
    </PageLayout>
  );
}

function LoginWithAuth0() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <PageLayout>
      <>
        <h1 className="white-text">Welcome to Your Custom Dev Portal!</h1>
        <h3 className="white-text">Sign up or Log in to get started.</h3>
      </>
    </PageLayout>
  );
}

export default function Login() {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return <LoginWithOkta />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return <LoginWithAuth0 />;
  } 
}
