const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnect");

const Group = sequelize.define("groups", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  about: { type: DataTypes.STRING, allowNull: true },
  noOfUsers: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
});

module.exports = Group;
