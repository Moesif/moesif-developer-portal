import { useOktaAuth } from "@okta/okta-react";
import React from "react";
import { MobileNavBarTab } from "./mobile-nav-bar-tab";

export const MobileNavBarTabs = ({ handleClick }) => {
  const { authState } = useOktaAuth(); 
  const isAuthenticated = authState?.isAuthenticated;

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
