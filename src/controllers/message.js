const { sendSuccess, sendError } = require("../utils/responseHandler");
const messageServices = require("../services/dbCallServices/messageServices");

const getMessages = async (req, res) => {
  try {
    const { lastMessageId } = req.query;
    const messages = await messageServices.getMessages(lastMessageId);
    return sendSuccess(res, { messages }, "Messages fetched successfully");
  } catch (error) {
    console.log(error);
    return sendError(res, `${error.message}`);
  }
};

const getOlderMessages = async (req, res) => {
  try {
    const { oldMessageId } = req.query;
    const messages = await messageServices.getOlderMessages(oldMessageId);
    return sendSuccess(res, { messages }, "Old messages fetched successfully");
  } catch (error) {
    console.log(error);
    return sendError(res, `${error.message}`);
  }
};

const sendMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { message } = req.body;

    const newMessage = await messageServices.sendMessage(message, userId);

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
