import React, { createContext, useState } from "react";

const StripeContext = createContext();

export const StripeProvider = ({ children }) => {
  const [subscriptionID, setSubscriptionID] = useState(null);
  const [customerID, setCustomerID] = useState(null);

  return (
    <StripeContext.Provider
      value={{ subscriptionID, setSubscriptionID, customerID, setCustomerID }}
    >
      {children}
    </StripeContext.Provider>
  );
};
