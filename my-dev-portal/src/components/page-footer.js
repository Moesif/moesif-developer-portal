import React from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import { LoginButton } from "./buttons/login-button";
// import { LogoutButton } from "./buttons/logout-button";
// import { SignupButton } from "./buttons/signup-button";

export const PageFooter = () => {
  // const { isAuthenticated } = useAuth0();

  return (
    <footer className="page-footer">
      <div className="page-footer-grid">
        <div className="page-footer-grid__info">

          <div className="page-footer-info__button">
            {/* {!isAuthenticated && (
              <>
                <SignupButton />
                <LoginButton />
              </>
            )}
            {isAuthenticated && (
              <>
                <LogoutButton />
              </>
            )} */}
          </div>
        </div>
      </div>
    </footer>
  );
};
