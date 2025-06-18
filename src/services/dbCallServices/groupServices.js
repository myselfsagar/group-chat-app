const Group = require("../../models/Group");

exports.createGroup = async (name, about = "", createdBy) => {
  try {
    const group = await Group.create({ name, about, noOfUsers: 1, createdBy });
    return group;
  } catch (error) {
    throw error;
  }
};
