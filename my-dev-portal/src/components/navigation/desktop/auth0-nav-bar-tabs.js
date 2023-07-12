import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { NavBarTab } from "./nav-bar-tab";

function Auth0NavBarTabs() {
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

export default Auth0NavBarTabs
