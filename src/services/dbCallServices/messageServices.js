const Message = require("../../models/Message");
const { Op } = require("sequelize");

exports.getMessages = async (lastMessageId = 0) => {
  try {
    const messages = await Message.findAll({
      where: { id: { [Op.gt]: lastMessageId } },
      order: [["createdAt", "ASC"]],
    });
    return messages;
  } catch (error) {
    throw error;
  }
};

exports.getOlderMessages = async (oldMessageId = 0) => {
  try {
    const oldMessages = await Message.findAll({
      where: { id: { [Op.lt]: oldMessageId } },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });
    return oldMessages;
  } catch (error) {
    throw error;
  }
};

exports.sendMessage = async (message, userId) => {
  try {
    const newMessage = await Message.create({ message, userId });
    return newMessage;
  } catch (error) {
    throw error;
  }
};
