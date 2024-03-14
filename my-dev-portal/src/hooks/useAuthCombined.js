import { useAuth0 } from "@auth0/auth0-react";
import { useOktaAuth } from "@okta/okta-react";
import { useNavigate } from "react-router-dom";

// purpose to consolidate the different hooks from auth provider.
export default function useAuthCombined() {
  const navigate = useNavigate();

  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    const { authState } = useOktaAuth();

    const isAuthenticated = authState?.isAuthenticated;

    let isLoading = !authState || authState?.isPending;
    let user = authState?.idToken?.claims;

    const handleSignUp = async ({ returnTo }) => {
      navigate(`/signup?return_to=${encodeURIComponent(returnTo)}`);
    };

    return {
      isAuthenticated,
      isLoading,
      user,
      oktaAuthState: authState,
      handleSignUp
    };
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    const {
      user: auth0User,
      isLoading: auth0IsLoading,
      isAuthenticated,
      loginWithRedirect,
    } = useAuth0();

    let isLoading = auth0IsLoading;
    let user = auth0User;

    const handleSignUp = async ({ returnTo }) => {
      await loginWithRedirect({
        appState: {
          returnTo: returnTo || "/product-select",
        },
        authorizationParams: {
          prompt: "login",
          screen_hint: "signup",
        },
        scope: "openid profile email offline_access",
      });
    };

    return {
      isAuthenticated,
      user,
      isLoading,
      handleSignUp
    };
  }

  throw new Error(
    `process.env.REACT_APP_AUTH_PROVIDER not provided or not supported`
  );
}
