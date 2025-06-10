const userServices = require("../services/dbCallServices/userServices");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendSuccess, sendError } = require("../utils/responseHandler");

const signupControllerGet = (req, res) => {
  return res.sendFile("register.html", { root: "src/views" });
};

const signupController = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const user = await userServices.getUserByEmail(email);
    if (user) {
      return sendError(res, "user already exist", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userServices.createUser(
      name,
      email,
      phone,
      hashedPassword
    );

    return sendSuccess(res, "Signup successful", 201);
  } catch (error) {
    console.log(error);
    return sendError(res, error.message);
  }
};

const loginControllerGet = (req, res) => {
  return res.sendFile("login.html", { root: "src/views" });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userServices.getUserByEmail(email);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return sendError(res, "Incorrect password", 401);
    }

    const access_token = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return sendSuccess(res, { access_token }, "Login successful");
  } catch (error) {
    console.log(error);
    return sendError(res, error.message);
  }
};

module.exports = {
  signupControllerGet,
  signupController,
  loginControllerGet,
  loginController,
};
