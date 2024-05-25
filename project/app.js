const express = require("express");
const path = require("path");
const morgan = require("morgan");
const nunjucks = require("nunjucks");

const { sequelize } = require("./models");
const indexRouter = require("./routes");
const usersRouter = require("./routes/users");

const app = express();
app.set("port", process.env.PORT || 3001);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

// DB와의 연결 확인
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('데이터베이스 연결 성공!');
//   })
//   .catch((err) => {
//     console.error('DB에 연결할 수 없음', err);
//   });

// sequelize.sync() : 모든 모델을 DB와 동기화
// sync(): DB내 해당 모델의 table이 없는 경우만 새로 생성
// sync({force:true}): DB내 기존 table을 drop후 새로 생성
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

app.use("/", indexRouter);
app.use("/users", usersRouter);

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
