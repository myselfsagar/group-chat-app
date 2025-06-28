const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnect");

const UserGroup = sequelize.define("userGroups", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: { type: DataTypes.ENUM("active", "removed"), defaultValue: "active" },
});

module.exports = UserGroup;
