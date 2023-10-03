import React from "react";
import { AuthProvider } from "@asgardeo/auth-react";

const config = {
  signInRedirectURL: "http://127.0.0.1:3000/dashboard",
  signOutRedirectURL: "http://127.0.0.1:3000/",
  clientID: "C7hX3qLfxBx08tBWuQjFIx3mMpMa",
  baseUrl: "https://api.asgardeo.io/t/moesif",
  scope: [ "openid","profile","email" ]
};


export const AsgardeoProviderWithNavigate = ({ children }) => {
    return (
        <AuthProvider config={ config }>
        {children}
        </AuthProvider>
    );
};