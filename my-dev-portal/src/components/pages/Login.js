import { useOktaAuth } from "@okta/okta-react";
import { useNavigate } from 'react-router-dom';

import { PageLayout } from "../page-layout";
import { PageLoader } from "../page-loader";

export default function Login() {
  const { authState } = useOktaAuth();
  const navigate = useNavigate();

  if (authState?.isAuthenticated) {
    navigate('/dashboard');
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

