const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnect");

const Message = sequelize.define("messages", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  message: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false }, // Sender
  receiverId: { type: DataTypes.INTEGER, allowNull: true }, // ✅ Receiver (only for private chats)
  groupId: { type: DataTypes.INTEGER, allowNull: true }, // ✅ Group (only for group chats)
});

module.exports = Message;
