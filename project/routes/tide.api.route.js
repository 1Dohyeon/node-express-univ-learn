const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/tide", async (req, res) => {
  const { place, date } = req.query;
  const apiKey = process.env.TIDE_API_KEY;

  const url = `https://www.khoa.go.kr/api/oceangrid/tideObsPreTab/search.do?ServiceKey=${apiKey}&ObsCode=${place}&Date=${date}&ResultType=json`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "API 데이터를 불러오는데 실패하였습니다." });
  }
});

module.exports = router;
