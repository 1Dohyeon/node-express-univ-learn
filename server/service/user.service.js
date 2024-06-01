const User = require("../models/user.entity");

exports.getUserById = async (id) => {
  return await User.findByPk(id);
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "nickname", "location"],
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("user_profile.html", { user });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getMyPage = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "nickname", "location"],
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("user_my.html", { user });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateUser = async (id, data) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    await user.update(data);
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};
