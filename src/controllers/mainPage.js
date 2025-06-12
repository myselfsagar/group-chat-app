const { sendSuccess, sendError } = require("../utils/responseHandler");
const Message = require("../models/Message");

exports.getHomePage = (req, res, next) => {
  res.sendFile("home.html", { root: "src/views" });
};

exports.sendMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { message } = req.body;

    const newMessage = await Message.create({ message, userId });

    return sendSuccess(res, newMessage, "Message sent", 201);
  } catch (error) {
    console.log(error);
    return sendError(res, `${error.message}`);
  }
};
