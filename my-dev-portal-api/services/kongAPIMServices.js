// create Kong Customer:

async function createKongConnectCustomer({ username, customId }) {
  console.log("Kong Konnect, collecting runtime group ID");
  const konnectURL = `${process.env.KONNECT_API_URL}/${process.env.KONNECT_API_VERSION}`;
  // get Konnect Runtime Group ID
  console.log("Kong Konnect, collecting runtime group ID");
  const rtgResponse = await fetch(
    `${konnectURL}/runtime-groups?filter[name][eq]=${process.env.KONNECT_RUNTIME_GROUP_NAME}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.KONNECT_PAT}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  if (!rtgResponse.ok) {
    console.log(
      `Failed GET Konnect API for runtime group: ${rtgResponse.status}, ${rtgResponse.statusText}`
    );
    console.log(
      `${konnectURL}/runtime-groups?filter[name][eq]=${process.env.KONNECT_RUNTIME_GROUP_NAME}`
    );
    throw new Error("Failed GET Konnect API for runtime group");
  }

  const rtgResult = await rtgResponse.json();

  console.log(`Got Konnect runtime group ID: ${rtgResult.data[0].id}`);
  const konnectRtgId = rtgResult.data[0].id;

  // create Konnect Consumer
  var kongConsumer = {
    username: username,
    custom_id: customId,
  };

  console.log("Kong Konnect, ensuring a consumer exists");
  const consumerResponse = await fetch(
    `${konnectURL}/runtime-groups/${konnectRtgId}/core-entities/consumers/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KONNECT_PAT}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(kongConsumer),
    }
  );

  return consumerResponse;
}

async function createKongEnterpriseCustomer({ username, customId }) {
  var body = { username: username, custom_id: customId };
  return await fetch(`${process.env.KONG_URL}/consumers/`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

async function createKonnectApiKeyForCustomer({ email }) {
  console.log("Kong Konnect, collecting runtime group ID");
  const konnectURL = `${process.env.KONNECT_API_URL}/${process.env.KONNECT_API_VERSION}`;
  // get Konnect Runtime Group ID
  console.log("Kong Konnect, collecting runtime group ID");
  const rtgResponse = await fetch(
    `${konnectURL}/runtime-groups?filter[name][eq]=${process.env.KONNECT_RUNTIME_GROUP_NAME}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.KONNECT_PAT}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  if (!rtgResponse.ok) {
    throw new Error("Failed GET Konnect API for runtime group");
  }

  const rtgResult = await rtgResponse.json();

  console.log(`Got Konnect runtime group ID: ${rtgResult.data[0].id}`);
  const konnectRtgId = rtgResult.data[0].id;

  //get kong consumer
  const consumerResponse = await fetch(
    `${konnectURL}/runtime-groups/${konnectRtgId}/core-entities/consumers/${encodeURIComponent(
      email
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.KONNECT_PAT}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  if (!consumerResponse.ok) {
    console.log(
      `Failed GET Konnect consumer : ${consumerResponse.status}, ${consumerResponse.statusText}`
    );
    throw new Error("Failed GET Konnect API for runtime group");
  }

  const consumerResult = await consumerResponse.json();

  // create Konnect Consumer Key-Auth
  const konnectKeyResponse = await fetch(
    `${konnectURL}/runtime-groups/${konnectRtgId}/core-entities/consumers/${consumerResult.id}/key-auth`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KONNECT_PAT}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  if (!konnectKeyResponse.ok) {
    console.log(
      `${konnectURL}/runtime-groups/${konnectRtgId}/core-entities/consumers/${consumerResult.id}/key-auth`
    );
    console.log(
      `Failed POST Konnect API for key-auth: ${konnectKeyResponse.status}, ${konnectKeyResponse.statusText}`
    );
    throw new Error("Failed POST Konnect API for key-auth");
  }
  const konnectKeyResult = await konnectKeyResponse.json();

  return konnectKeyResult;
}

async function createKongEnterpriseApiKeyCustomer({  email }) {
  // Kong Enterprise
  //TODO: Add admin api token for Kong Enterprise
  console.log(
    `${process.env.KONG_URL}/consumers/${encodeURIComponent(email)}/key-auth`
  );
  const response = await fetch(
    `${process.env.KONG_URL}/consumers/${encodeURIComponent(email)}/key-auth`,
    {
      method: "POST",
    }
  );
  var data = await response.json();
  console.log(data);
  return data;
}

module.exports = {
  createKongConnectCustomer,
  createKongEnterpriseCustomer,
  createKonnectApiKeyForCustomer,
  createKongEnterpriseApiKeyCustomer,
};
