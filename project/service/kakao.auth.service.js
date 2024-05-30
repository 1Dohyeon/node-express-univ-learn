const { KakaoUser } = require("../models");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

function startKakaoLogin(req, res) {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_API_KEY,
    redirect_uri: process.env.CODE_REDIRECT_URI,
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();

  const finalUrl = `${baseUrl}?${params}`;
  console.log("Generated URL:", finalUrl);
  return finalUrl;
}

function getKakaoUrl(req) {
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
  console.log("Generated Kakao URL:", finalUrl);
  return finalUrl;
}

async function finishKakaoLogin(finalUrl, req, res) {
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
    } = userRequest;

    // 사용자 정보 저장 또는 업데이트
    let user = await KakaoUser.findOne({ where: { id } });
    if (!user) {
      user = await KakaoUser.create({ id, name: nickname });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log({
      id: user.id,
      name: user.name,
      token: token,
    });

    // 세션에 데이터 저장
    req.session.kakaoUser = {
      k: "kakao",
      id: user.id,
      name: user.name,
      token: token,
    };

    // JWT 토큰을 쿠키에 저장
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 환경에 따라 secure 설정
      maxAge: 3600000, // 1시간
    });

    res.redirect("/");
  } else {
    return res.redirect("/login");
  }
}

module.exports = { startKakaoLogin, getKakaoUrl, finishKakaoLogin };
