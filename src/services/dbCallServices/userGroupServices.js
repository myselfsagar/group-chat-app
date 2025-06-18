const Group = require("../../models/Group");
const UserGroup = require("../../models/UserGroup");

exports.createUserGroup = async (userId, groupId) => {
  try {
    const group = await UserGroup.create({ userId, groupId });
    return group;
  } catch (error) {
    throw error;
  }
};

exports.checkUserInGroup = async (userId, groupId) => {
  try {
    const isMember = await UserGroup.findOne({ where: { userId, groupId } });
    return isMember;
  } catch (error) {
    throw error;
  }
};

exports.getGroupsByUser = async (userId) => {
  try {
    const memberships = await UserGroup.findAll({
      where: { userId },
      include: Group,
    });
    return memberships.map((entry) => entry.group);
  } catch (error) {
    throw error;
  }
};
