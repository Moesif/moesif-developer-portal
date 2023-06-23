import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginCallback } from "@okta/okta-react";
import { useAuth0 } from "@auth0/auth0-react";

import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import Settings from "./components/pages/Settings";
import StripeProducts from "./components/stripe/StripeProducts";
import { OktaProviderWithNavigate } from "./OktaProviderWithNavigate";
import { Auth0ProviderWithNavigate } from "./Auth0ProviderWithNavigate";
import Keys from "./components/pages/Keys";
import SecureRoute from "./components/okta/SecureRoute";
import { AuthenticationGuard } from "./components/authentication-guard";

function App() {
  const { isAuthenticated } = useAuth0();

  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return (
      <div className="App">
        <header className="App-header">
          <BrowserRouter>
            <OktaProviderWithNavigate>
              <Routes>
                <Route path="/" element={<Login />} />
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
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return (
      <div className="App">
        <header className="App-header">
          <BrowserRouter>
            <Auth0ProviderWithNavigate>
              <Routes>
                <Route
                  path="/"
                  element={
                    !isAuthenticated ? (
                      <Login />
                    ) : (
                      <Navigate replace to={"dashboard"} />
                    )
                  }
                />
                <Route path="product-select" element={<StripeProducts />} />
                <Route
                  path="dashboard"
                  element={<AuthenticationGuard component={Dashboard} />}
                />
                <Route
                  path="settings"
                  element={<AuthenticationGuard component={Settings} />}
                />
                <Route
                  path="keys"
                  element={<AuthenticationGuard component={Keys} />}
                />
              </Routes>
            </Auth0ProviderWithNavigate>
          </BrowserRouter>
        </header>
      </div>
    );
  }
}

export default App;
