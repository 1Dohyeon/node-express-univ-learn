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
      nickname, // 사용자 입력 닉네임 사용
    });
    res.redirect("/login");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// 로그인
exports.login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
      return res.json({ success: true });
    });
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
  console.log("Kakao URL:", finalUrl);
  return finalUrl;
};

const generateUniqueNickname = async (baseNickname) => {
  const generateRandomNumber = () =>
    Math.floor(100000000 + Math.random() * 900000000); // 9자리 랜덤 숫자 생성

  let uniqueNickname = baseNickname + generateRandomNumber();
  let isUnique =
    (await User.findOne({ where: { nickname: uniqueNickname } })) === null;

  while (!isUnique) {
    uniqueNickname = baseNickname + generateRandomNumber();
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
      const uniqueNickname = await generateUniqueNickname("user");
      user = await User.create({
        id,
        email,
        password: await bcrypt.hash(email, 10), // 이메일을 해시하여 비밀번호로 사용
        name: nickname,
        nickname: uniqueNickname, // uniqueNickname 사용
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
