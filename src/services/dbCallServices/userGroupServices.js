const Group = require("../../models/Group");
const User = require("../../models/User");
const UserGroup = require("../../models/UserGroup");

const createUserGroup = async (userId, groupId, isAdmin) => {
  try {
    const existing = await UserGroup.findOne({ where: { userId, groupId } });

    if (existing) {
      if (existing.status === "removed") {
        await existing.update({ status: "active", isAdmin });
        return existing;
      } else {
        throw new Error("User is already an active member of this group");
      }
    }

    return await UserGroup.create({
      userId,
      groupId,
      isAdmin,
      status: "active",
    });
  } catch (error) {
    throw error;
  }
};

const getGroupsByUser = async (userId) => {
  try {
    const memberships = await UserGroup.findAll({
      where: { userId, status: "active" },
      include: Group,
    });
    return memberships.map((entry) => entry.group);
  } catch (error) {
    throw error;
  }
};

const getGroupMembers = async (groupId) => {
  try {
    const members = await UserGroup.findAll({
      where: { groupId, status: "active" },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      attributes: ["isAdmin"],
    });
    return members, members;
  } catch (error) {
    throw error;
  }
};

const updateRole = async (userId, groupId, isAdmin) => {
  return await UserGroup.update({ isAdmin }, { where: { userId, groupId } });
};

const updateStatus = async (userId, groupId, status) => {
  return await UserGroup.update({ status }, { where: { userId, groupId } });
};

const isGroupMember = async (userId, groupId) => {
  const record = await UserGroup.findOne({
    where: { userId, groupId, status: "active" },
  });
  return !!record;
};

const isGroupAdmin = async (userId, groupId) => {
  const record = await UserGroup.findOne({
    where: { userId, groupId, status: "active", isAdmin: true },
  });
  return !!record;
};

module.exports = {
  createUserGroup,
  getGroupsByUser,
  getGroupMembers,
  updateRole,
  updateStatus,
  isGroupMember,
  isGroupAdmin,
};
