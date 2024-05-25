const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid token");
  }
};

module.exports = { generateToken, verifyToken };
