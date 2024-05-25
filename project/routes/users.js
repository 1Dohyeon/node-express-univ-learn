const express = require("express");
const User = require("../models/user");
const SearchHistory = require("../models/searchHistory");

const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const user = await User.create({
        name: req.body.name,
        age: req.body.age,
        notice: req.body.notice,
      });
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.get("/:id/comments", async (req, res, next) => {
  try {
    const searchHistory = await SearchHistory.findAll({
      include: {
        model: User,
        where: { id: req.params.id },
      },
    });
    res.json(searchHistory);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
