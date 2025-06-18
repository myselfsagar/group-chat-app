const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnect");

const UserGroup = sequelize.define("userGroups", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
});

module.exports = UserGroup;
