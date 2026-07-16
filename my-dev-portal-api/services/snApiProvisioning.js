const fetch = require("node-fetch");

function requireConfig(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for SN API provisioning`);
  return value.replace(/\/$/, "");
}

function unixTimestampToIso(value) {
  return value ? new Date(value * 1000).toISOString() : undefined;
}

function getPlanKey(price, product) {
  const configured = price?.metadata?.plan_key || product?.metadata?.plan_key;
  if (configured) return configured;

  const name = `${product?.name || ""} ${price?.nickname || ""}`.toLowerCase();
  for (const planKey of ["enterprise", "growth", "basic"]) {
    if (name.includes(planKey)) return planKey;
  }
  throw new Error(
    "Unable to determine plan_key. Add plan_key metadata to the Stripe price or product."
  );
}

function getOrganizationName(authUser, customer) {
  return (
    customer?.name ||
    authUser?.organization_name ||
    authUser?.org_name ||
    authUser?.email?.split("@")[1] ||
    authUser?.email
  );
}

async function provisionSnApiCustomer({
  authUser,
  customer,
  subscription,
  price,
  product,
  rotateApiKey = false,
}) {
  const snApiBaseUrl = requireConfig("SN_API_BASE_URL");
  const provisioningToken = requireConfig("SN_API_PROVISIONING_TOKEN");
  if (!authUser?.sub || !authUser?.email) {
    throw new Error("Authenticated Auth0 user id and email are required");
  }
  if (!customer?.id || !subscription?.id) {
    throw new Error("Stripe customer and subscription are required");
  }

  const customerEmail = customer.email || authUser.email;
  if (customerEmail.toLowerCase() !== authUser.email.toLowerCase()) {
    throw new Error("Stripe customer does not match the authenticated user");
  }

  const response = await fetch(
    `${snApiBaseUrl}/api/v3/developer-portal/provision`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Developer-Portal-Token": provisioningToken,
      },
      body: JSON.stringify({
        auth0_user_id: authUser.sub,
        email: authUser.email,
        full_name: authUser.name || authUser.nickname || authUser.email,
        organization_name: getOrganizationName(authUser, customer),
        stripe_customer_id: customer.id,
        stripe_subscription_id: subscription.id,
        stripe_product_id: product?.id,
        stripe_price_id: price?.id,
        plan_key: getPlanKey(price, product),
        subscription_status: subscription.status,
        current_period_start: unixTimestampToIso(subscription.current_period_start),
        current_period_end: unixTimestampToIso(subscription.current_period_end),
        cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
        rotate_api_key: rotateApiKey,
        metadata: { source: "moesif_developer_portal" },
      }),
    }
  );
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      `SN API provisioning failed (${response.status}): ${JSON.stringify(body)}`
    );
  }
  return body;
}

async function snApiKeyRequest(path, { method = "GET", body } = {}) {
  const snApiBaseUrl = requireConfig("SN_API_BASE_URL");
  const provisioningToken = requireConfig("SN_API_PROVISIONING_TOKEN");
  const response = await fetch(`${snApiBaseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Developer-Portal-Token": provisioningToken,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const responseBody =
    response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      responseBody?.detail || responseBody?.message || "SN API key request failed"
    );
    error.status = response.status;
    throw error;
  }
  return responseBody;
}

async function getSnApiPortalContext(authUser) {
  if (!authUser?.sub) {
    throw new Error("Authenticated Auth0 user id is required");
  }
  return snApiKeyRequest(
    `/api/v3/developer-portal/portal-context?auth0_user_id=${encodeURIComponent(
      authUser.sub
    )}`
  );
}

function listSnApiKeys(authUser) {
  return snApiKeyRequest(
    `/api/v3/developer-portal/portal-api-keys?auth0_user_id=${encodeURIComponent(
      authUser.sub
    )}`
  );
}

function createSnApiKey(authUser, { name, description }) {
  return snApiKeyRequest("/api/v3/developer-portal/portal-api-keys", {
    method: "POST",
    body: {
      auth0_user_id: authUser.sub,
      name,
      description: description || null,
    },
  });
}

function revokeSnApiKey(authUser, apiKeyId) {
  return snApiKeyRequest(
    `/api/v3/developer-portal/portal-api-keys/${apiKeyId}?auth0_user_id=${encodeURIComponent(
      authUser.sub
    )}`,
    { method: "DELETE" }
  );
}

function rotateSnApiKey(authUser, apiKeyId) {
  return snApiKeyRequest(
    `/api/v3/developer-portal/portal-api-keys/${apiKeyId}/rotate`,
    {
      method: "POST",
      body: { auth0_user_id: authUser.sub },
    }
  );
}

module.exports = {
  provisionSnApiCustomer,
  getSnApiPortalContext,
  listSnApiKeys,
  createSnApiKey,
  revokeSnApiKey,
  rotateSnApiKey,
};
