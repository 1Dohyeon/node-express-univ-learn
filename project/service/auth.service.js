const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function checkEmail(email) {
  const alreadyUser = await User.findOne({ where: { email } });
  return !!alreadyUser;
}

async function createUser(name, email, password) {
  const user = await User.create({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
  });
  return user;
}

async function login(email, password) {
  const user = await User.findOne({ where: { email } });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error("로그인 실패");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { token, user: { id: user.id, name: user.name } };
}

module.exports = { checkEmail, createUser, login };
