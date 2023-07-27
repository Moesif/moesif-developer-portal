import { useOktaAuth } from "@okta/okta-react";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginButtonWithOkta = ({isLink}) => {
  const { oktaAuth } = useOktaAuth();

  const handleLogin = async () => {
    await oktaAuth.signInWithRedirect({ originalUri: "/dashboard" });
  };

  const className = isLink ? " button__link lowercase" : "button__login";

  return (
    <button className="button__login" onClick={handleLogin}>
      Log In
    </button>
  );
};

const LoginButtonWithAuth0 = ({isLink}) => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/dashboard",
      },
      authorizationParams: {
        prompt: "login",
      },
    });
  };
  const className = isLink ? " button__link lowercase" : "button__login";

  return (
    <button className={className} onClick={handleLogin}>
      Log In
    </button>
  );
};

export const LoginButton = ({isLink}) => {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return <LoginButtonWithOkta isLink={isLink} />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return <LoginButtonWithAuth0 isLink={isLink} />;
  } else {
    return null; // or some error message
  }
};



