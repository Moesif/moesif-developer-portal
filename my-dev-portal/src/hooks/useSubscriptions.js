import { useState, useEffect } from "react";

// This is set up as a hook so that
// in case other pages need subscription info
// it can also be reused.
export default function useSubscriptions({ user, idToken, accessToken }) {
  const [subscriptions, setSubscriptions] = useState(null);
  const [finishedLoading, setFinishedLoading] = useState(false);

  useEffect(() => {
    if (user?.email && idToken) {
      fetch(
        `${
          process.env.REACT_APP_DEV_PORTAL_API_SERVER
        }/subscriptions?email=${encodeURIComponent(user.email)}`,
        {
          headers: {
            // for this demo, we decide to use idToken
            // for two reasons:
            // - idToken already have email in the claim, and typically for user administrative related
            //   things like subscription, it is perfect reasonable approach to use idToken.
            // - accessToken is more used with scopes, to respect the scopes in accessToken and
            //   create the scopes, it will require a lot more configuration.
            Authorization: `Bearer ${idToken}`,
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          setFinishedLoading(true);
          setSubscriptions(result);
        })
        .catch((err) => {
          setFinishedLoading(true);
          console.error("failed to load subscriptions", err);
        });
    }
  }, [user, idToken]);

  return {
    subscriptions,
    finishedLoading,
  };
}
