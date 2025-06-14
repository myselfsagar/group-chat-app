const { sendSuccess, sendError } = require("../utils/responseHandler");
const messageServices = require("../services/dbCallServices/messageServices");

const getMessages = async (req, res) => {
  try {
    const messages = await messageServices.getMessages();
    return sendSuccess(res, { messages }, "Messages fetched successfully");
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
  sendMessage,
};
