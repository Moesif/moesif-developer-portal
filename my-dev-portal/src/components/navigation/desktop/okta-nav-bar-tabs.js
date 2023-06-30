import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import { NavBarTab } from "./nav-bar-tab";

const OktaNavBarTabs = () => {
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

export default OktaNavBarTabs
