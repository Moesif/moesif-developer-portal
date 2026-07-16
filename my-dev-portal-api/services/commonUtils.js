function getUnifiedCustomerIdCached(authUser) {
  return authUser?.moesif_user_id;
}

async function getUnifiedCustomerId(authUser) {
  return getUnifiedCustomerIdCached(authUser);
}

module.exports = {
  getUnifiedCustomerIdCached,
  getUnifiedCustomerId,
};
