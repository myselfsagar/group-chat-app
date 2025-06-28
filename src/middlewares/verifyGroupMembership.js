const userGroupServices = require("../services/dbCallServices/userGroupServices");
const { sendError } = require("../utils/responseHandler");

const verifyGroupMembership = async (req, res, next) => {
  const { groupId } = req.query;
  const userId = req.userId;

  if (!groupId || groupId == "null") return next();
  try {
    if (!(await userGroupServices.isGroupMember(userId, groupId))) {
      return sendError(
        res,
        "Access Denied: You are not part of this group",
        403
      );
    }

    next();
  } catch (error) {
    console.log("Something went wrong", error);
    return sendError(res, error.message);
  }
};

module.exports = verifyGroupMembership;
