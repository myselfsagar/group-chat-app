const { sendSuccess, sendError } = require("../utils/responseHandler");
const messageServices = require("../services/dbCallServices/messageServices");

const getMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { lastMessageId, receiverId, groupId } = req.query;

    const messages = await messageServices.getMessages(
      lastMessageId,
      userId,
      receiverId,
      groupId
    );
    return sendSuccess(res, { messages }, "Messages fetched successfully");
  } catch (error) {
    console.log(error);
    return sendError(res, `${error.message}`);
  }
};

const getOlderMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { oldMessageId, receiverId, groupId } = req.query;

    const messages = await messageServices.getOlderMessages(
      oldMessageId,
      userId,
      receiverId,
      groupId
    );
    return sendSuccess(res, { messages }, "Old messages fetched successfully");
  } catch (error) {
    console.log(error);
    return sendError(res, `${error.message}`);
  }
};

const sendMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { message, receiverId } = req.body;
    const { groupId } = req.query;

    const newMessage = await messageServices.sendMessage(
      message,
      userId,
      receiverId,
      groupId
    );

    return sendSuccess(res, newMessage, "Message sent", 201);
  } catch (error) {
    console.log(error);
    return sendError(res, `${error.message}`);
  }
};

module.exports = {
  getMessages,
  getOlderMessages,
  sendMessage,
};
