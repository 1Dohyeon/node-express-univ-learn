const User = require("../models/user.entity");
const axios = require("axios");

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
      return res.status(404).send("사용자를 찾을 수 없습니다.");
    }
    res.render("user_my.html", { user });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateUser = async (userId, updateData) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    await user.update(updateData);
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.searchAddress = async (query) => {
  try {
    const response = await axios.get(
      "https://dapi.kakao.com/v2/local/search/address.json",
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_JS_KET}`,
        },
        params: {
          query: query,
        },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};
