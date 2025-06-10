const userServices = require("../services/dbCallServices/userServices");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupControllerGet = (req, res) => {
  return res.sendFile("register.html", { root: "src/views" });
};

const signupController = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const user = await userServices.getUserByEmail(email);
    if (user) {
      return res.status(409).json({ error: "user already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userServices.createUser(
      name,
      email,
      phone,
      hashedPassword
    );

    res.status(201).json({ message: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
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
      return res.status(404).json({ error: "User not found" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const access_token = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.json({ access_token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signupControllerGet,
  signupController,
  loginControllerGet,
  loginController,
};
