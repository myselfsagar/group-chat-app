const express = require("express");
const mainPageController = require("../controllers/mainPage");
const router = express.Router();

//middlewares
const authMiddleware = require("../middlewares/authMiddleware.js");
const validateRequest = require("../middlewares/validateRequest");
const schemas = require("../utils/validationSchemas");

router.get("/", mainPageController.getHomePage);

router.post(
  "/send-message",
  authMiddleware,
  validateRequest(schemas.sendMessage),
  mainPageController.sendMessage
);

module.exports = router;
