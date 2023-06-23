import React from 'react';
import SecureRoute from './okta/SecureRoute';
import { PageLoader } from './page-loader';

export const AuthenticationGuard = ({ children }) => {
  return (
    <React.Suspense fallback={<PageLoader />}>
      <SecureRoute>{children}</SecureRoute>
    </React.Suspense>
  );
};
