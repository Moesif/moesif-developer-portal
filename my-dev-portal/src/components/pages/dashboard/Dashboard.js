import OktaDashboard from "./OktaDashboard";
import Auth0Dashboard from "./Auth0Dashboard";

function fetchEmbedInfo(userId, setIFrameSrcLiveEvent, setIFrameSrcTimeSeries, setError) {
  fetch(`${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/embed-dash-live-event/` + encodeURIComponent(userId))
    .then(function (response) {
      if (response.ok) {
        return response;
      } else {
        console.log(response.statusText);
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (body) {
      setIFrameSrcLiveEvent( body ? body.url : "");
    })
    .catch(function (err) {
      setError("Could not load charts");
    });

    fetch(`${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/embed-dash-time-series/` + encodeURIComponent(userId))
    .then(function (response) {
      if (response.ok) {
        return response;
      } else {
        console.log(response.statusText);
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (body) {
      setIFrameSrcTimeSeries( body ? body.url : "");
    })
    .catch(function (err) {
      setError("Could not load. Please check if you created .env with MOESIF_MANAGEMENT_TOKEN && MOESIF_TEMPLATE_WORKSPACE_ID and run `node server.js`.");
    });
}

export default function Dashboard() {
  if (process.env.REACT_APP_AUTH_PROVIDER === "Okta") {
    return <OktaDashboard fetchEmbedInfo={fetchEmbedInfo} />;
  } else if (process.env.REACT_APP_AUTH_PROVIDER === "Auth0") {
    return <Auth0Dashboard fetchEmbedInfo={fetchEmbedInfo} />;
  }
}