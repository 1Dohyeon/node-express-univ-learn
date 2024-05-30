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
  try {
    const kakaoTokenRequest = await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    }).then((response) => response.json());

    console.log("Kakao Token Request Response:", kakaoTokenRequest);

    if ("access_token" in kakaoTokenRequest) {
      const { access_token } = kakaoTokenRequest;
      const userRequest = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-type": "application/json",
        },
      }).then((response) => response.json());

      console.log("User Request Response:", userRequest);

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

      // 사용자 정보와 토큰을 로그에 출력
      console.log("Kakao User Info:", {
        id: kakaoUserInfo.id,
        name: kakaoUserInfo.name,
        token: token,
      });

      // 세션에 데이터 저장
      req.session.kakaoUser = {
        id: kakaoUserInfo.id,
        name: kakaoUserInfo.name,
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
      console.error("Kakao token request failed:", kakaoTokenRequest);
      res.status(401).json({ success: false, message: "카카오 로그인 실패" });
    }
  } catch (error) {
    console.error("Error during Kakao login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { startKakaoLogin, getKakaoUrl, finishKakaoLogin };
