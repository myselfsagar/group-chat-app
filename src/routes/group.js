const express = require("express");
const groupController = require("../controllers/group.js");
const router = express.Router();

//middlewares
const authMiddleware = require("../middlewares/authMiddleware.js");
const validateRequest = require("../middlewares/validateRequest");
const verifyGroupMembership = require("../middlewares/verifyGroupMembership.js");
const schemas = require("../utils/validationSchemas");

router.post(
  "/create",
  authMiddleware,
  validateRequest(schemas.createGroup),
  groupController.createGroup
);

router.get("/my-groups", authMiddleware, groupController.getMyGroups);

router.get(
  "/:groupId/members",
  authMiddleware,
  verifyGroupMembership,
  groupController.getGroupMembers
);

router.post(
  "/invite",
  authMiddleware,
  verifyGroupMembership,
  groupController.inviteToGroup
);

router.post(
  "/makeAdmin",
  authMiddleware,
  verifyGroupMembership,
  groupController.makeGroupAdmin
);

router.post(
  "/remove",
  authMiddleware,
  verifyGroupMembership,
  groupController.removeGroupMember
);

module.exports = router;
