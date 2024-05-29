const express = require("express");
const { KakaoUser } = require("../models");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 이메일 중복 확인
router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    return res.status(400).json({ error: "이미 존재하는 이메일입니다." });
  }
  return res.status(200).json({ message: "사용 가능한 이메일입니다." });
});

// 회원가입
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ success: false, message: "로그인 실패" });
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ success: true, token, user: { id: user.id, name: user.name } });
});

// 카카오 로그인 시작
router.get("/kakao/start", (req, res) => {
  const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_API_KEY}&redirect_uri=${process.env.CODE_REDIRECT_URI}`;
  res.redirect(url);
});
// 카카오 로그인 완료
router.get("/kakao/finish", async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    client_id: process.env.KAKAO_API_KEY,
    client_secret: process.env.KAKAO_SECRET,
    grant_type: "authorization_code",
    redirect_uri: process.env.CODE_REDIRECT_URI,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  try {
    const kakaoTokenRequest = await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    }).then((response) => response.json());

    if ("access_token" in kakaoTokenRequest) {
      const { access_token } = kakaoTokenRequest;
      const userRequest = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-type": "application/json",
        },
      }).then((response) => response.json());

      const {
        id,
        properties: { nickname },
      } = userRequest;

      // 사용자 정보 저장 또는 업데이트
      let kakaoUserInfo = await KakaoUser.findOne({ where: { id } });
      if (!kakaoUserInfo) {
        kakaoUserInfo = await KakaoUser.create({ id, name: nickname });
      }

      const token = jwt.sign({ id: kakaoUserInfo.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      // 세션에 데이터 저장
      req.session.kakaoUser = {
        id: kakaoUserInfo.id,
        name: kakaoUserInfo.name,
        token: token,
      };

      res.json({
        id: kakaoUserInfo.id,
        name: kakaoUserInfo.name,
        token: token,
      });
    } else {
      res.status(401).json({ success: false, message: "카카오 로그인 실패" });
    }
  } catch (error) {
    console.error("Error during Kakao login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
