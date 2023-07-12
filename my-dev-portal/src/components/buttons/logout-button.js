import { useOktaAuth } from "@okta/okta-react";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LogoutButtonWithOkta = () => {
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

const LogoutButtonWithAuth0 = () => {
  const { logout } = useAuth0();

  const handleLogout = async () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <button className="button__logout" onClick={handleLogout}>
      Log Out
    </button>
  );
};

export const LogoutButton = () => {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return <LogoutButtonWithOkta />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return <LogoutButtonWithAuth0 />;
  }
};