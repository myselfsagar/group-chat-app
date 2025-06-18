const userGroupServices = require("../services/dbCallServices/userGroupServices");
const { sendError } = require("../utils/responseHandler");

const verifyGroupMembership = async (req, res, next) => {
  const { groupId } = req.query;
  const userId = req.userId;

  if (!groupId || groupId == "null") return next();

  const isMember = await userGroupServices.checkUserInGroup(userId, groupId);
  if (!isMember) {
    return sendError(res, "Access Denied: You are not part of this group", 403);
  }

  next();
};

module.exports = verifyGroupMembership;
