const User = require("../../models/User");

const getUserById = async (userId) => {
  return await User.findByPk(userId, {
    attributes: ["id", "name", "email"],
  });
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    throw error;
  }
};

const createUser = async (name, email, phone, password) => {
  try {
    const newUser = await User.create({ name, email, phone, password });
    return newUser;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
};
