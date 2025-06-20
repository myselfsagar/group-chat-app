const express = require("express");
const messageController = require("../controllers/message.js");
const router = express.Router();

//middlewares
const authMiddleware = require("../middlewares/authMiddleware.js");
const validateRequest = require("../middlewares/validateRequest");
const verifyGroupMembership = require("../middlewares/verifyGroupMembership.js");
const schemas = require("../utils/validationSchemas");

router.get(
  "/get-messages",
  authMiddleware,
  verifyGroupMembership,
  messageController.getMessages
);

router.get(
  "/get-older-messages",
  authMiddleware,
  verifyGroupMembership,
  messageController.getOlderMessages
);

router.post(
  "/send-message",
  authMiddleware,
  validateRequest(schemas.sendMessage),
  verifyGroupMembership,
  messageController.sendMessage
);

module.exports = router;
