const User = require("../../models/User");

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    throw error;
  }
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
