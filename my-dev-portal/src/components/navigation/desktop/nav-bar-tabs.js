import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import { useAuth0 } from "@auth0/auth0-react";
import { NavBarTab } from "./nav-bar-tab";

const NavBarTabsWithOkta = () => {
  const { authState } = useOktaAuth();
  const isAuthenticated = authState?.isAuthenticated;

  return (
    <div className="nav-bar__tabs">
      {!isAuthenticated && (
        <NavBarTab path="/" label="Home" />
      )}
      {isAuthenticated && (
        <>
          <NavBarTab path="/settings" label="Settings" />
          <NavBarTab path="/dashboard" label="Dashboard" />
          <NavBarTab path="/keys" label="Keys" />
        </>
      )}
    </div>
  );
};

const NavBarTabsWithAuth0 = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="nav-bar__tabs">
      {!isAuthenticated && (
        <NavBarTab path="/" label="Home" />
      )}
      {isAuthenticated && (
        <>
          <NavBarTab path="/settings" label="Settings" />
          <NavBarTab path="/dashboard" label="Dashboard" />
          <NavBarTab path="/keys" label="Keys" />
        </>
      )}
    </div>
  );
};

export const NavBarTabs = () => {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return <NavBarTabsWithOkta />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return <NavBarTabsWithAuth0 />;
  }
};
