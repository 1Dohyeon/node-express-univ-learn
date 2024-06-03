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

exports.getSidoList = async () => {
  // 시/도 목록을 가져오는 로직 (예: 외부 API 호출 또는 자체 데이터베이스 사용)
  // 여기서는 예제로 간단한 배열을 반환합니다.
  return ["서울특별시", "부산광역시", "대구광역시"];
};

exports.getGunguList = async (sido) => {
  // 군/구 목록을 가져오는 로직 (예: 외부 API 호출 또는 자체 데이터베이스 사용)
  // 여기서는 예제로 간단한 객체를 사용합니다.
  const gunguData = {
    서울특별시: ["강남구", "강동구", "강북구", "중구"],
    부산광역시: ["중구", "서구", "동구"],
    대구광역시: ["남구", "북구", "수성구"],
  };
  return gunguData[sido] || [];
};
