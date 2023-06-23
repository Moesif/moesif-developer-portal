import React from 'react';
import SecureRoute from './okta/SecureRoute';
import { PageLoader } from './page-loader';
import { withAuthenticationRequired } from "@auth0/auth0-react";

export const AuthenticationGuard = ({ children, component }) => {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return (
      <React.Suspense fallback={<PageLoader />}>
        <SecureRoute>{children}</SecureRoute>
      </React.Suspense>
    );
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    const Component = withAuthenticationRequired(component, {
      onRedirecting: () => (
        <div className="page-layout">
          <PageLoader />
        </div>
      ),
    });

    return <Component />;
  } 
};
