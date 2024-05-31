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

exports.updateUser = async (req, res) => {
  try {
    const { name, nickname, location } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (name) user.name = name;
    if (nickname) user.nickname = nickname;
    if (location) user.location = location;

    await user.save();
    res.send("User updated successfully!");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
