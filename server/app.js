const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const session = require("express-session");
const passport = require("./config/passportConfig");
const { sequelize } = require("./models/index.entity");
const path = require("path");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS 설정
app.use(cors());

// 뷰 엔진 설정
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

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
app.use(passport.initialize());
app.use(passport.session());

// 정적 파일 제공 설정
app.use("/client", express.static(path.join(__dirname, "client")));

// 라우트 설정
const indexRouter = require("./routes/index.route");
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const postRouter = require("./routes/post.route");

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/posts", postRouter);

// 서버 시작
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
