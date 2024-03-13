import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginCallback } from "@okta/okta-react";
import { useAuth0 } from "@auth0/auth0-react";

import Login from "./components/pages/login/Login";
import Dashboard from "./components/pages/dashboard/Dashboard";
import Settings from "./components/pages/settings/Settings";
import StripeProducts from "./components/stripe/StripeProducts";
import { OktaProviderWithNavigate } from "./OktaProviderWithNavigate";
import { Auth0ProviderWithNavigate } from "./Auth0ProviderWithNavigate";
import Keys from "./components/pages/keys/Keys";
import SecureRoute from "./components/okta/SecureRoute";
import { AuthenticationGuard } from "./components/authentication-guard";
import SignUp from "./components/pages/signup/SignUp";
import RedirectToSignIn from "./components/pages/signup/OktaPostCreate";
import { StripeProvider } from "./StripeProvider";
import Return from "./components/pages/return/Return";
import Setup from "./components/pages/setup/Setup";
import Plans from "./components/pages/plans/Plans";

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
                <Route path="/signup" element={<SignUp />} />
                <Route path="login/callback" element={<LoginCallback />} />
                <Route path="/return" element={<Return />} />
                <Route path="/setup" element={<Setup />} />
                <Route path="/plans" element={<Plans />} />
                <Route
                  path="login/oktapostcreate"
                  element={<RedirectToSignIn />}
                />
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
              <StripeProvider>
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
                  <Route path="/return" element={<Return />} />
                  <Route path="/setup" element={<Setup />} />
                  <Route path="/plans" element={<Plans />} />
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
              </StripeProvider>
            </Auth0ProviderWithNavigate>
          </BrowserRouter>
        </header>
      </div>
    );
  } else {
    return (
      <div className="App">
        Please check your env files, the REACT_APP_AUTH_PROVIDER variable must
        be provided.
      </div>
    );
  }
}

export default App;
