const express = require("express");
const messageController = require("../controllers/message.js");
const router = express.Router();

//middlewares
const authMiddleware = require("../middlewares/authMiddleware.js");
const validateRequest = require("../middlewares/validateRequest");
const schemas = require("../utils/validationSchemas");

router.get("/get-messages", authMiddleware, messageController.getMessages);

router.post(
  "/send-message",
  authMiddleware,
  validateRequest(schemas.sendMessage),
  messageController.sendMessage
);

module.exports = router;
