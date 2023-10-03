import React from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { NavBarTab } from "./nav-bar-tab";

function AsgardeoNavBarTabs() {
  const { state } = useAuthContext();

  return (
    <div className="nav-bar__tabs">
      {state.isAuthenticated && (
        <>
          <NavBarTab path="/settings" label="Settings" />
          <NavBarTab path="/dashboard" label="Dashboard" />
          <NavBarTab path="/keys" label="Keys" />
        </>
      )}
    </div>
  );
};

export default AsgardeoNavBarTabs
