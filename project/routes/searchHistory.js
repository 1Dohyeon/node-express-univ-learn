const express = require("express");
const { SearchHistory } = require("../models");

const router = express.Router();

// 검색 기록 저장
router.post("/save", async (req, res) => {
  const { searcher_id, place, search_time } = req.body;
  try {
    const searchHistory = await SearchHistory.create({
      searcher_id,
      place,
      search_time,
    });
    res.status(201).json(searchHistory);
  } catch (error) {
    console.error("검색 기록 저장 실패:", error);
    res
      .status(500)
      .json({ error: "검색 기록 저장 실패", details: error.message });
  }
});

module.exports = router;
