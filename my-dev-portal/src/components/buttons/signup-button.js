import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthContext } from "@asgardeo/auth-react";
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

const SignupButtonWithAuth0 = ({ isLink }) => {
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
      scope: 'openid profile email offline_access',
    });
  };

  const className = isLink ? " button__link" : "button__sign-up";

  return (
    <button className={className} onClick={handleSignUp}>
      Sign Up
    </button>
  );
};

const SignupButtonWithAsgardeo = ({ isLink }) => {

  const { signIn } = useAuthContext();

  const handleSignUp = async () => {
    await signIn();
  };

  const className = isLink ? " button__link lowercase" : "button__login";

  return (
    <button className={className} onClick={handleSignUp}>
      Sign Up
    </button>
  );
};

export const SignupButton = ({ isLink }) => {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return <SignupButtonWithOkta isLink={isLink} />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return <SignupButtonWithAuth0 isLink={isLink} />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Asgardeo") {
    return <SignupButtonWithAsgardeo isLink={isLink} />;
  }
};
