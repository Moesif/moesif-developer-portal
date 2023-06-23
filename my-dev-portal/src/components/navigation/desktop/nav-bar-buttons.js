import { useOktaAuth } from "@okta/okta-react";
import React from "react";
import { LoginButton } from "../../buttons/login-button";
import { LogoutButton } from "../../buttons/logout-button";
// import { SignupButton } from "../../buttons/signup-button";

export const NavBarButtons = () => {
  const { authState } = useOktaAuth(); 
  const isAuthenticated = authState?.isAuthenticated;

  return (
    <div className="nav-bar__buttons">
      {!isAuthenticated && (
        <>
          {/* <SignupButton /> */}
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

