const express = require("express");
const router = express.Router();

//routes
const mainPageRoutes = require("./mainPage.js");
const authRoutes = require("./auth");

//middlewares
const notFound = require("../middlewares/notFound.js");

router.use("/auth", authRoutes);
router.use(mainPageRoutes);
router.use(notFound);

module.exports = router;
