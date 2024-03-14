import { useAuth0 } from "@auth0/auth0-react";
import { useOktaAuth } from "@okta/okta-react";

// purpose to consolidate the different hooks from auth provider.
export function useNormalizedAuthState() {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    const { authState } = useOktaAuth();
    const isAuthenticated = authState?.isAuthenticated;

    let isLoading = !authState || authState?.isPending;
    let user = authState?.idToken?.claims;

    return {
      isAuthenticated,
      isLoading,
      user,
      oktaAuthState: authState
    };
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    const { user: auth0User, isLoading: auth0IsLoading, isAuthenticated } = useAuth0();

    let isLoading = auth0IsLoading;
    let user = auth0User;

    return {
      isAuthenticated,
      user,
      isLoading
    }
  }

  throw new Error(`process.env.REACT_APP_AUTH_PROVIDER not provided or not supported`);
}
