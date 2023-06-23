import { useOktaAuth } from "@okta/okta-react";
import React from "react";

export const LogoutButton = () => {
  const { oktaAuth } = useOktaAuth();

  const handleLogout = async () => {
    await oktaAuth.signOut();
  };

  return (
    <button className="button__logout" onClick={handleLogout}>
      Log Out
    </button>
  );
};

