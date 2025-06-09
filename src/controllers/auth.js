const userServices = require("../services/dbCallServices/userServices");
const bcrypt = require("bcrypt");

const signupControllerGet = async (req, res) => {
  return res.sendFile("register.html", { root: "src/views" });
};

const signupController = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const user = await userServices.getUserByEmail(email);
    if (user) {
      return res.status(404).json({ error: "user already exist" });
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

module.exports = {
  signupControllerGet,
  signupController,
};
