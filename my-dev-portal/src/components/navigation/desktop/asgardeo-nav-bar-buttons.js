import React from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { LoginButton } from "../../buttons/login-button";
import { LogoutButton } from "../../buttons/logout-button";
import { SignupButton } from "../../buttons/signup-button";

function AsgardeoNavBarButtons() {
  const { state } = useAuthContext();

  return (
    <div className="nav-bar__buttons">
      {!state.isAuthenticated && (
        <>
          <SignupButton />
          <LoginButton />
        </>
      )}
      {state.isAuthenticated && (
        <>
          <LogoutButton />
        </>
      )}
    </div>
  );
};

export default AsgardeoNavBarButtons
