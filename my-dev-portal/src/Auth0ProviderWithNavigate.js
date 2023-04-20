import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Auth0ProviderWithNavigate = ({ children }) => {
    const navigate = useNavigate();

    const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
    };


    return (
        <Auth0Provider
        domain="dev-zojlepeedyeleun3.us.auth0.com"
        clientId="VFgqgySNsjhRJCl5DjsU6niftMDxIByT"
        authorizationParams={{
            redirect_uri: window.location.origin
        }}
        onRedirectCallback={onRedirectCallback}
        >
        {children}
        </Auth0Provider>
    );
};