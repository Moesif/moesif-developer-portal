import { useAuth0 } from "@auth0/auth0-react";
import { useOktaAuth } from "@okta/okta-react";
import { useNavigate } from "react-router-dom";

// purpose to consolidate the different hooks from auth provider.

function useAuthOktaVersion() {
  const navigate = useNavigate();
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
    handleSignUp,
  };
}

function useAuthAuth0Version() {
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
    handleSignUp,
  };
}

const finalResolved =  process.env.REACT_APP_AUTH_PROVIDER === "Okta" ? useAuthOktaVersion : useAuthAuth0Version;

export default finalResolved;
