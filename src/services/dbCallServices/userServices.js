const User = require("../../models/User");

const getUserById = async (userId, options = {}) => {
  return await User.findByPk(userId, {
    attributes: ["id", "name", "email"],
    ...options,
  });
};

const getUserByEmail = async (email, options = {}) => {
  try {
    const user = await User.findOne({
      where: { email },
      ...options,
    });
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
