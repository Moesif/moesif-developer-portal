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

export default async function fetchEmbedChartUrls({
  stripCustomerId,
  authUserId,
  idToken,
  setError,
  email,
}) {
  const response = await fetch(
    `${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/embed-charts/` +
      encodeURIComponent(authUserId) + `?email=` + encodeURIComponent(email),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );

  const embedInfoArray = await response.json();

  if (embedInfoArray) {
    return embedInfoArray.map((item) => {
      const customizedUrl = customizeUrlDisplayOptions(item);
      console.log("custom 1 " + customizedUrl);
      return customizedUrl;
    });
  } else {
    return [];
  }
}
