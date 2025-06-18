const { sendSuccess, sendError } = require("../utils/responseHandler");
const groupServices = require("../services/dbCallServices/groupServices");
const userServices = require("../services/dbCallServices/userServices");
const userGroupServices = require("../services/dbCallServices/userGroupServices");

const getMyGroups = async (req, res) => {
  try {
    const userId = req.userId;
    const groups = await userGroupServices.getGroupsByUser(userId);
    return sendSuccess(res, { groups }, "Groups fetched successfully", 200);
  } catch (error) {
    console.log(error);
    return sendError(res, `${error.message}`);
  }
};

const createGroup = async (req, res) => {
  try {
    const { name, about } = req.body;
    const group = await groupServices.createGroup(name, about, req.userId);
    await userGroupServices.createUserGroup(req.userId, group.id);
    return sendSuccess(res, { group }, "Group created", 201);
  } catch (error) {
    console.log(error);
    return sendError(res, `${error.message}`);
  }
};

const inviteToGroup = async (req, res) => {
  try {
    const { email, groupId } = req.query;

    const user = await userServices.getUserByEmail(email);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    await userGroupServices.createUserGroup(user.id, groupId);
    return sendSuccess(res, "User invited to the group");
  } catch (error) {
    console.log(error);
    return sendError(res, `${error.message}`);
  }
};

module.exports = {
  getMyGroups,
  createGroup,
  inviteToGroup,
};
