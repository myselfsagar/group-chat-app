const express = require("express");
const router = express.Router();

//routes
const authRoutes = require("./auth");
const mainPageRoutes = require("./mainPage.js");
const messageRoutes = require("./message");

//middlewares
const notFound = require("../middlewares/notFound.js");

router.use("/auth", authRoutes);
router.use(mainPageRoutes);
router.use("/messages", messageRoutes);

router.use(notFound);

module.exports = router;
