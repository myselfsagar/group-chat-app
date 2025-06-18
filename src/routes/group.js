const express = require("express");
const groupController = require("../controllers/group.js");
const router = express.Router();

//middlewares
const authMiddleware = require("../middlewares/authMiddleware.js");
const validateRequest = require("../middlewares/validateRequest");
const verifyGroupMembership = require("../middlewares/verifyGroupMembership.js");
const schemas = require("../utils/validationSchemas");

router.get("/my-groups", authMiddleware, groupController.getMyGroups);

router.post(
  "/create",
  authMiddleware,
  validateRequest(schemas.createGroup),
  groupController.createGroup
);

router.post(
  "/invite",
  authMiddleware,
  verifyGroupMembership,
  groupController.inviteToGroup
);

module.exports = router;
