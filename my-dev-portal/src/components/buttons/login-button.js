import { useOktaAuth } from "@okta/okta-react";
import React from "react";

export const LoginButton = () => {
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

