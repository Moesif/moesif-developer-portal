import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "../../buttons/login-button";
import { LogoutButton } from "../../buttons/logout-button";
import { SignupButton } from "../../buttons/signup-button";

export const MobileNavBarButtons = () => {

  const { authState } = useOktaAuth(); 
  const oktaIsAuthenticated = authState?.isAuthenticated;

  const { isAuthenticated: auth0IsAuthenticated } = useAuth0();

  let isAuthenticated;

  if(process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    isAuthenticated = oktaIsAuthenticated;
  } else if(process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    isAuthenticated = auth0IsAuthenticated;
  }

  return (
    <div className="mobile-nav-bar__buttons">
      {!isAuthenticated && process.env.REACT_APP_AUTH_PROVIDER === "Okta" && (
        <>
          <LoginButton />
        </>
      )}
      {!isAuthenticated && process.env.REACT_APP_AUTH_PROVIDER === "Auth0" && (
        <>
          <SignupButton />
          <LoginButton />
        </>
      )}
      {isAuthenticated && (
        <>
          <LogoutButton />
        </>
      )}
    </div>
  );
};
