import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import { useAuth0 } from "@auth0/auth0-react";
import { MobileNavBarTab } from "./mobile-nav-bar-tab";

export const MobileNavBarTabs = ({ handleClick }) => {
  const { authState } = useOktaAuth(); 
  const oktaIsAuthenticated = authState?.isAuthenticated;

  const { isAuthenticated: auth0IsAuthenticated } = useAuth0();

  let isAuthenticated;

  if(process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    isAuthenticated = oktaIsAuthenticated;
  } else if(process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    isAuthenticated = auth0IsAuthenticated;
  }

  return (
    <div className="mobile-nav-bar__tabs">
      {!isAuthenticated && (
        <MobileNavBarTab
          path="/home"
          label="Home"
          handleClick={handleClick}
        />
      )}
      {isAuthenticated && (
        <>
          <MobileNavBarTab
            path="/settings"
            label="Settings"
            handleClick={handleClick}
          />
          <MobileNavBarTab
            path="/dashboard"
            label="Dashboard"
            handleClick={handleClick}
          />
          <MobileNavBarTab
            path="/keys"
            label="Keys"
            handleClick={handleClick}
          />
        </>
      )}
    </div>
  );
};
