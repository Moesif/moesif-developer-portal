import CombinedDashboard from './CombinedDashboard';

function customizeUrlDisplayOptions(embedInfo) {
  // see here
  // https://www.moesif.com/docs/embedded-templates/creating-and-using-templates/#display-options

  const displayOptions = {
    embed: true,
    hide_header: true,
    show_daterange: true,
    primary_color: "#000",
  };

  return `https://www.moesif.com/public/em/ws/${
    embedInfo._id
  }?${new URLSearchParams(displayOptions).toString()}#${embedInfo.token}`;
}

function fetchEmbedInfo({
  stripCustomerId,
  authUserId,
  setIFrameSrcLiveEvent,
  setIFrameSrcTimeSeries,
  setError
}) {

  const userId = stripCustomerId; // authUserId;
  // depends your data model (see assumptions in DATA_MODEL.md),
  // and if in your API gateway if you identifyUser using stripeCustomerId
  // or the userId from authorization provider.
  // even perhaps you have your own userId for your own system.
  fetch(
    `${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/embed-dash-live-event/` +
      encodeURIComponent(userId)
  )
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
      const customizedUrl = customizeUrlDisplayOptions(body);
      console.log('custom 1 ' + customizedUrl);
      setIFrameSrcLiveEvent(customizedUrl);
    })
    .catch(function (err) {
      console.error(err);
      setError("Could not load charts.w");
    });

  fetch(
    `${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/embed-dash-time-series/` +
      encodeURIComponent(userId)
  )
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
      const customizedUrl = customizeUrlDisplayOptions(body);
      console.log('customized Url'+  customizedUrl);
      setIFrameSrcTimeSeries(customizedUrl);
    })
    .catch(function (err) {
      console.error(err);
      setError(
        "Could not load. Please check if you created .env with MOESIF_MANAGEMENT_TOKEN && MOESIF_TEMPLATE_WORKSPACE_ID and run `node server.js`."
      );
    });
}

export default function Dashboard() {
  return <CombinedDashboard fetchEmbedInfo={fetchEmbedInfo} />
}
