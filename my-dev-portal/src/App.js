import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginCallback } from "@okta/okta-react";

import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import Settings from "./components/pages/Settings";
import StripeProducts from "./components/stripe/StripeProducts";
import { OktaProviderWithNavigate } from "./OktaProviderWithNavigate";
import Keys from "./components/pages/Keys";
import SecureRoute from "./components/okta/SecureRoute";

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <OktaProviderWithNavigate>
            <Routes>
              <Route
                path="/"
                element={<Login />}
              />
              <Route path="login/callback" element={<LoginCallback />} />
              <Route path="product-select" element={<StripeProducts />} />
              <Route
                path="dashboard"
                element={
                  <SecureRoute>
                    <Dashboard />
                  </SecureRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <SecureRoute>
                    <Settings />
                  </SecureRoute>
                }
              />
              <Route
                path="keys"
                element={
                  <SecureRoute>
                    <Keys />
                  </SecureRoute>
                }
              />
            </Routes>
          </OktaProviderWithNavigate>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
