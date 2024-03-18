import { useState, useEffect } from "react";

// This is set up as a hook so that
// in case other pages need subscription info
// it can also be reused.
export default function useSubscriptions(user) {
  const [subscriptions, setSubscriptions] = useState(null);
  const [finishedLoading, setFinishedLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetch(
        `${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/subscriptions?email=${encodeURIComponent(user.email)}`,
        {
          headers: {},
        }
      )
        .then((res) => res.json())
        .then((result) => {
          setFinishedLoading(true);
          setSubscriptions(result);
        })
        .catch((err) => {
          setFinishedLoading(true);
          console.error('failed to load subscriptions', err);
        });
    }
  }, [user]);

  return {
    subscriptions,
    finishedLoading,
  };
}
