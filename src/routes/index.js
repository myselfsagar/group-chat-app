const express = require("express");
const router = express.Router();

//routes
const authRoutes = require("./auth");
const mainPageRoutes = require("./mainPage.js");
const userRoutes = require("./user.js");
const messageRoutes = require("./message");
const groupRoutes = require("./group.js");

//middlewares
const notFound = require("../middlewares/notFound.js");

router.use("/auth", authRoutes);
router.use(mainPageRoutes);
router.use("/users", userRoutes);
router.use("/messages", messageRoutes);
router.use("/groups", groupRoutes);

router.use(notFound);

module.exports = router;
