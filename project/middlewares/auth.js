const { verifyToken } = require("../utils/jwt");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "토큰이 필요합니다." });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // 디코딩된 토큰을 요청 객체에 추가
    next();
  } catch (err) {
    return res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
};

module.exports = authMiddleware;
