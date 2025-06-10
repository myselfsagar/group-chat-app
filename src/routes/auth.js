const express = require("express");
const authControllers = require("../controllers/auth");
const validateRequest = require("../middlewares/validateRequest");
const schemas = require("../utils/validationSchemas");
const router = express.Router();

router.get("/register", authControllers.signupControllerGet);
router.post(
  "/register",
  validateRequest(schemas.register),
  authControllers.signupController
);

router.get("/login", authControllers.loginControllerGet);
router.post(
  "/login",
  validateRequest(schemas.login),
  authControllers.loginController
);

module.exports = router;
