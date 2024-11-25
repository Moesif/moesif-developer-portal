import isNil from "lodash/isNil";

export function formatPrice(priceInDecimal = 0) {
  if (isNil(priceInDecimal)) {
    return "";
  }

  const priceInDollars = Number(priceInDecimal) / 100;

  // Format the price as a currency string with up to 10 decimal places
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0, // Minimum number of decimal places
    maximumFractionDigits: 10, // Maximum number of decimal places
  }).format(priceInDollars);
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
