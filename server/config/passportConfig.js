const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const KakaoStrategy = require("passport-kakao").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user.entity");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: "이메일이 일치하지 않습니다." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, {
            message: "패스워드가 일치하지 않습니다.",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// passport.use(
//   new KakaoStrategy(
//     {
//       clientID: process.env.KAKAO_API_KEY,
//       callbackURL: process.env.KAKAO_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const {
//           id,
//           username,
//           _json: {
//             kakao_account: { email },
//           },
//         } = profile;
//         let user = await User.findOne({ where: { id } });
//         if (!user) {
//           const uniqueNickname = await generateUniqueNickname("user");
//           user = await User.create({
//             id,
//             email,
//             password: await bcrypt.hash(email, 10), // 이메일을 해시하여 비밀번호로 사용
//             name: username,
//             nickname: uniqueNickname,
//           });
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id); // User 모델을 직접 사용
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
