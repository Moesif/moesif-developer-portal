import { useOktaAuth } from "@okta/okta-react";
import React from "react";
import { NavBarTab } from "./nav-bar-tab";

export const NavBarTabs = () => {
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
