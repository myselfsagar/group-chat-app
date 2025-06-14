const Message = require("../../models/Message");

exports.getMessages = async () => {
  try {
    const messages = await Message.findAll({ order: [["updatedAt", "ASC"]] });
    return messages;
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
