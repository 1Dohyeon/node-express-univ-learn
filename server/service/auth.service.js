const User = require("../models/user.entity");
const bcrypt = require("bcrypt");
const passport = require("passport");

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
