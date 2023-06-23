import { useOktaAuth } from "@okta/okta-react";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginButtonWithOkta = () => {
  const { oktaAuth } = useOktaAuth();

  const handleLogin = async () => {
    await oktaAuth.signInWithRedirect({ originalUri: "/dashboard" });
  };

  return (
    <button className="button__login" onClick={handleLogin}>
      Log In
    </button>
  );
};

const LoginButtonWithAuth0 = () => {
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

  return (
    <button className="button__login" onClick={handleLogin}>
      Log In
    </button>
  );
};

export const LoginButton = () => {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return <LoginButtonWithOkta />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return <LoginButtonWithAuth0 />;
  } else {
    return null; // or some error message
  }
};



