const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controllers/user");

router.get("/me", authMiddleware, userController.getMyProfile);

module.exports = router;
