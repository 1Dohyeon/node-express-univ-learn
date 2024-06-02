const User = require("../models/user.entity");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

// 이메일 중복 체크
exports.checkEmailAvailability = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    res.json({ available: !user });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// 닉네임 중복 체크
exports.checkNicknameAvailability = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { nickname: req.params.nickname },
    });
    res.json({ available: !user });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// 회원가입
exports.register = async (req, res) => {
  try {
    const { email, name, nickname, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
      name,
      nickname,
    });
    res.redirect("/login");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// 로그인
exports.login = (req, res, next) => {
  return passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

// 로그아웃
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.startKakaoLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_API_KEY,
    redirect_uri: process.env.KAKAO_CALLBACK_URL,
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();

  const finalUrl = `${baseUrl}?${params}`;
  console.log("Generated URL:", finalUrl);
  res.redirect(finalUrl);
};

exports.getKakaoUrl = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    client_id: process.env.KAKAO_API_KEY,
    grant_type: "authorization_code",
    redirect_uri: process.env.KAKAO_CALLBACK_URL,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  console.log("Generated Kakao URL:", finalUrl);
  return finalUrl;
};

exports.generateUniqueNickname = async (baseNickname) => {
  let uniqueNickname = baseNickname + Math.floor(1000 + Math.random() * 9000);
  let isUnique =
    (await User.findOne({ where: { nickname: uniqueNickname } })) === null;

  while (!isUnique) {
    uniqueNickname = baseNickname + Math.floor(1000 + Math.random() * 9000);
    isUnique =
      (await User.findOne({ where: { nickname: uniqueNickname } })) === null;
  }

  return uniqueNickname;
};

exports.finishKakaoLogin = async (finalUrl, req, res) => {
  const kakaoTokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    })
  ).json();

  if ("access_token" in kakaoTokenRequest) {
    const { access_token } = kakaoTokenRequest;
    const userRequest = await (
      await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-type": "application/json",
        },
      })
    ).json();

    const {
      id,
      properties: { nickname },
      kakao_account: { email },
    } = userRequest;

    // 사용자 정보 저장 또는 업데이트
    let user = await User.findOne({ where: { id } });
    if (!user) {
      const uniqueNickname = await exports.generateUniqueNickname("user");
      user = await User.create({
        id,
        email,
        password: email,
        name: nickname,
        nickname: uniqueNickname,
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log({
      id: user.id,
      name: user.name,
      email: user.email,
      nickname: user.nickname,
      token: token,
    });

    // 세션에 데이터 저장
    req.session.kakaoUser = {
      way: "kakao",
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      token: token,
    };

    // JWT 토큰을 쿠키에 저장
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 환경에 따라 secure 설정
      maxAge: 3600000, // 1시간
    });

    // 사용자 객체를 세션에 저장하여 req.user로 접근할 수 있도록 함
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } else {
    return res.redirect("/login");
  }
};
