import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const SignupButtonWithOkta = ({ isLink }) => {
  const navigate = useNavigate();

  const handleSignUp = async () => {
    navigate("/signup");
  };

  const className = isLink ? " button__link" : "button__sign-up";

  return (
    <button className={className} onClick={handleSignUp}>
      Sign Up
    </button>
  );
};

const SignupButtonWithAuth0 = ({ isLink, isPriceAction }) => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/plans",
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
      scope: "openid profile email offline_access",
    });
  };

  const className = isLink
    ? " button__link"
    : ` button__${isPriceAction ? "price-action" : "sign-up"}`;

  return (
    <button className={className} onClick={handleSignUp}>
      Sign Up
    </button>
  );
};

export const SignupButton = ({ isLink, isPriceAction }) => {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return (
      <SignupButtonWithOkta isLink={isLink} isPriceAction={isPriceAction} />
    );
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return (
      <SignupButtonWithAuth0 isLink={isLink} isPriceAction={isPriceAction} />
    );
  }
};
