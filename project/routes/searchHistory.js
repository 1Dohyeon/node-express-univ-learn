const express = require("express");
const { SearchHistory } = require("../models");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 미들웨어: 로그인 상태 확인
const authenticateToken = (req, res, next) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
  if (!token) return next(); // 토큰이 없으면 아무 작업도 하지 않음

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(); // 토큰이 유효하지 않으면 아무 작업도 하지 않음
    req.user = user;
    next();
  });
};

// 검색 기록 저장 또는 업데이트
router.post("/save", authenticateToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "로그인이 필요합니다." });
  }

  const { place, place_code, search_time } = req.body;
  try {
    const existingRecord = await SearchHistory.findOne({
      where: { searcher_id: req.user.id, place_code },
    });

    if (existingRecord) {
      // 기존 기록이 있으면 search_time만 갱신
      existingRecord.search_time = search_time;
      await existingRecord.save();
      res.status(200).json(existingRecord);
    } else {
      // 기존 기록이 없으면 새로 생성
      const searchHistory = await SearchHistory.create({
        searcher_id: req.user.id,
        place,
        place_code,
        search_time,
      });
      res.status(201).json(searchHistory);
    }
  } catch (error) {
    console.error("검색 기록 저장 실패:", error);
    res
      .status(500)
      .json({ error: "검색 기록 저장 실패", details: error.message });
  }
});

// 사용자 검색 기록 조회
router.get("/user/:userId", authenticateToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "로그인이 필요합니다." });
  }

  const { userId } = req.params;
  try {
    const searchHistory = await SearchHistory.findAll({
      where: { searcher_id: userId },
      order: [["search_time", "DESC"]],
      attributes: ["place", "search_time"], // 필요한 필드만 선택
    });
    res.json(searchHistory);
  } catch (error) {
    console.error("검색 기록 조회 실패:", error);
    res
      .status(500)
      .json({ error: "검색 기록 조회 실패", details: error.message });
  }
});

module.exports = router;
