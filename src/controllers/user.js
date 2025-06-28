const { sendSuccess, sendError } = require("../utils/responseHandler");
const userServices = require("../services/dbCallServices/userServices");

const getMyProfile = async (req, res) => {
  try {
    const userId = req.userId; // Populated by authMiddleware
    const user = await userServices.getUserById(userId);

    if (!user) return sendError(res, "User not found", 404);

    return sendSuccess(res, { user }, "User profile fetched");
  } catch (error) {
    console.error(error);
    return sendError(res, "Failed to fetch user profile");
  }
};

module.exports = { getMyProfile };
