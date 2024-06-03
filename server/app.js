const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const passport = require("./config/passportConfig");
const { sequelize } = require("./models/index.entity");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const timeSince = require("./helper/time");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS 설정
app.use(cors());

// 뷰 엔진 설정
app.set("view engine", "html");
const env = nunjucks.configure("views", {
  express: app,
  watch: true,
  autoescape: true,
  noCache: false,
  throwOnUndefined: true,
});

env.addFilter("timeSince", timeSince);

// 모델과의 동기화
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("model-DB table간 동기화 성공!");
  })
  .catch((err) => {
    console.error(err);
  });

// body-parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// session 및 passport 초기화
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// Flash 메시지 미들웨어 설정
app.use(flash());

// 글로벌 변수 설정
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// 정적 파일 제공 설정
app.use("/client", express.static(path.join(__dirname, "client")));

// 라우트 설정
const indexRouter = require("./routes/index.route");
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const postRouter = require("./routes/post.route");
const commentRouter = require("./routes/comment.route");

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

// 서버 시작
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
