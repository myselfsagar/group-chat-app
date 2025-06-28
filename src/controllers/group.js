const { sendSuccess, sendError } = require("../utils/responseHandler");
const groupServices = require("../services/dbCallServices/groupServices");
const userServices = require("../services/dbCallServices/userServices");
const userGroupServices = require("../services/dbCallServices/userGroupServices");

const createGroup = async (req, res) => {
  try {
    const { name, about } = req.body;
    const group = await groupServices.createGroup(name, about, req.userId);
    await userGroupServices.createUserGroup(req.userId, group.id, true);
    return sendSuccess(res, { group }, "Group created", 201);
  } catch (error) {
    console.log(error);
    return sendError(res, error.message);
  }
};

const getMyGroups = async (req, res) => {
  try {
    const userId = req.userId;
    const groups = await userGroupServices.getGroupsByUser(userId);
    return sendSuccess(res, { groups }, "Groups fetched successfully", 200);
  } catch (error) {
    console.log(error);
    return sendError(res, error.message);
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;

    const members = await userGroupServices.getGroupMembers(groupId);
    return sendSuccess(res, { members }, "Groups members fetched");
  } catch (error) {
    console.log(error);
    return sendError(res, error.message);
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
    return sendError(res, error.message);
  }
};

const makeGroupAdmin = async (req, res) => {
  try {
    const requesterId = req.userId;
    const { userId, groupId } = req.body;

    // Check if requester is an admin of the group
    if (!(await userGroupServices.isGroupAdmin(requesterId, groupId))) {
      return sendError(res, "Only admins are allowed to do this", 403);
    }

    // Check if target user is in the group
    if (!(await userGroupServices.isGroupMember(userId, groupId))) {
      return sendError(res, "User is not an active member of this group", 400);
    }

    // Promote user to admin
    await userGroupServices.updateRole(userId, groupId, true);

    return sendSuccess(res, null, "User promoted to admin");
  } catch (error) {
    console.log(error);
    return sendError(res, error.message);
  }
};

const removeGroupMember = async (req, res) => {
  try {
    const requesterId = req.userId;
    const { userId, groupId } = req.body;

    //check if the requester is admin
    if (!(await userGroupServices.isGroupAdmin(requesterId, groupId))) {
      return sendError(res, "Only admins are allowed to remove a member", 403);
    }

    //check if target user is part of the group
    if (!(await userGroupServices.isGroupMember(userId, groupId))) {
      return sendError(res, "User is not an active member of this group", 400);
    }

    //remove the user from group
    await userGroupServices.updateStatus(userId, groupId, "removed");

    return sendSuccess(res, null, "User removed from group");
  } catch (error) {
    console.log("Failed to remove user from group", error);
    return sendError(res, error.message);
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  getGroupMembers,
  inviteToGroup,
  makeGroupAdmin,
  removeGroupMember,
};
