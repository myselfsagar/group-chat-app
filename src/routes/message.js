const express = require("express");
const messageController = require("../controllers/message.js");
const router = express.Router();

//middlewares
const authMiddleware = require("../middlewares/authMiddleware.js");
const validateRequest = require("../middlewares/validateRequest");
const verifyGroupMembership = require("../middlewares/verifyGroupMembership.js");
const upload = require("../middlewares/upload");
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

router.post(
  "/send-file",
  authMiddleware,
  validateRequest(schemas.sendMessage),
  verifyGroupMembership,
  upload.single("file"),
  messageController.sendFile
);

module.exports = router;
