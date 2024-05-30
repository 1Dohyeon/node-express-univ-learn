// 라이브러리 설정
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const nunjucks = require("nunjucks");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();

// model 설정
const { sequelize } = require("./models");

// 각 라우터 설정
const indexRouter = require("./routes/index.route");
const authRouter = require("./routes/auth.route");
const usersRouter = require("./routes/users.route");
const protectedRouter = require("./routes/protected.route");
const apiRouter = require("./routes/tide.api.route");
const searchHistoryRouter = require("./routes/searchHistory.route");

// 포트번호 및 뷰 엔진 설정
app.set("port", process.env.PORT || 3001);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

// 세션 미들웨어 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
    }),
    cookie: { secure: false }, // 개발 환경에서는 false, 배포 환경에서는 true로 설정
  })
);

// DB와의 연결 확인
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("model-DB table간 동기화 성공!");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 라우터 엔드포인트 설정
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/protected", protectedRouter);
app.use("/api", apiRouter);
app.use("/searchHistory", searchHistoryRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(`http://localhost:${app.get("port")} 번 포트에서 대기 중`);
});
