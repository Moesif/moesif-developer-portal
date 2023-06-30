import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { PageLayout } from "../../page-layout";
import { PageLoader } from "../../page-loader";

function Auth0Login() {
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

export default Auth0Login
