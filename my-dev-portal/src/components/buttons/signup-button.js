import { useOktaAuth } from "@okta/okta-react";
import React from "react";

export const SignupButton = () => {
  const { oktaAuth } = useOktaAuth();

  const handleSignUp = async () => {
    await oktaAuth.signInWithRedirect({ originalUri: "/product-select" });
  };

  return (
    <button className="button__sign-up" onClick={handleSignUp}>
      Sign Up
    </button>
  );
};