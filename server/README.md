1. 설치 모듈

```
npm i express
npm i mysql2
npm i dotenv
npm i nunjucks
npm i chokidar
npm i body-parser
npm i express-session
npm i sequelize sequelize-cli
npm i passport passport-local bcrypt jsonwebtoken
npm i cors
```

2. 폴더 구조

```
server/
├── config/
│   ├── dbConfig.js
│   └── passportConfig.js
├── client/
│   └── register.client.js
├── models/
│   ├── user.entity.js
│   ├── post.entity.js
│   ├── comment.entity.js
│   └── index.js
├── routes/
│   ├── index.route.js
│   ├── user.route.js
│   └── auth.route.js
├── service/
│   ├── user.service.js
│   └── auth.service.js
├── views/
│   ├── index.html
│   ├── register.html
│   └── login.html
├── .env
├── app.js
├── README.ms
├── package.json
└── package-lock.json
```
