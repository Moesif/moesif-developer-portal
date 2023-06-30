import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';

const SignupButtonWithOkta = () => {
  const navigate = useNavigate();

  const handleSignUp = async () => {
    navigate('/signup');
  };

  return (
    <button className="button__sign-up" onClick={handleSignUp}>
      Sign Up
    </button>
  );
};

const SignupButtonWithAuth0 = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/product-select",
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  };

  return (
    <button className="button__sign-up" onClick={handleSignUp}>
      Sign Up
    </button>
  );
};

export const SignupButton = () => {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return <SignupButtonWithOkta />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return <SignupButtonWithAuth0 />;
  }
};
