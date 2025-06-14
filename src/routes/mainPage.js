const express = require("express");
const mainPageController = require("../controllers/mainPage");
const router = express.Router();

router.get("/", mainPageController.getHomePage);

module.exports = router;
