import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import Settings from "./components/pages/Settings";
import { AuthenticationGuard } from "./components/authentication-guard";
import StripeProducts from "./components/stripe/StripeProducts";
import { Auth0ProviderWithNavigate } from "./Auth0ProviderWithNavigate";
import Keys from "./components/pages/Keys";

function App() {
  const { isAuthenticated } = useAuth0();
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

export default App;
