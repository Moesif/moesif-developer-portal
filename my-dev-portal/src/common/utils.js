import isNil from "lodash/isNil";

export function formatPrice(priceInDecimal = 0, currency) {
  if (isNil(priceInDecimal)) {
    return "";
  }

  const priceInMajorUnits = Number(priceInDecimal) / 100;

  // Prices default to GBP; pass the price object's currency when available.
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: (currency || "GBP").toUpperCase(),
    minimumFractionDigits: 0, // Minimum number of decimal places
    maximumFractionDigits: 10, // Maximum number of decimal places
  }).format(priceInMajorUnits);
}

export function formatPeriod(periodUnits, period) {
  switch (periodUnits) {
    case "y":
      return "yearly";
    case "d":
      return "daily";
    case "M":
    default:
      return "monthly";
  }
}

export function formatIsoTimestamp(isoString) {
  // Create a new Date object from the ISO string
  try {
    const date = new Date(isoString);

    // Format the date to a human-readable string using the browser's locale
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Use 12-hour format
    });
  } catch (err) {
    return "";
  }
}

const portalContextCache = {};

export async function moesifIdentifyUserFrontEndIfPossible(idToken, user) {
  if (!window?.moesif || !idToken) {
    return;
  }

  try {
    let context = portalContextCache[idToken];
    if (!context) {
      const response = await fetch(
        `${import.meta.env.REACT_APP_DEV_PORTAL_API_SERVER}/portal-context`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      if (response.status === 404) {
        return;
      }
      if (!response.ok) {
        throw new Error(`Portal context request failed (${response.status})`);
      }
      context = await response.json();
      portalContextCache[idToken] = context;
    }

    window.moesif.identifyUser(context.moesif_user_id, {
      email: context.email || user?.email,
      auth0_user_id: context.auth0_user_id || user?.sub,
      stripe_customer_id: context.stripe_customer_id,
      company_id: context.moesif_company_id,
    });
    if (typeof window.moesif.identifyCompany === "function") {
      window.moesif.identifyCompany(context.moesif_company_id, {
        name: context.organization_name,
        stripe_customer_id: context.stripe_customer_id,
      });
    }
  } catch (error) {
    console.error("Failed to identify the canonical Moesif user", error);
  }
}
