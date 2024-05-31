const User = require("../models/user.entity");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
      name,
    });
    res.redirect("/login"); // '/auth/login'에서 '/login'으로 수정
  } catch (err) {
    res.status(500).send(err.message);
  }
};
