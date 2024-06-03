const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const authRouter = require("../routes/auth.route");
const User = require("../models/user.entity");
const bcrypt = require("bcrypt");

// Mock User model
jest.mock("../models/user.entity");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRouter);

// Mocking Passport.js
passport.use(
  new (require("passport-local").Strategy)((email, password, done) => {
    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password." });
          }
        });
      })
      .catch((err) => done(err));
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login successfully with correct credentials", async () => {
    const user = {
      id: 1,
      email: "test@example.com",
      password: await bcrypt.hash("password123", 10),
    };

    User.findOne.mockResolvedValue(user);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should fail login with incorrect email", async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "wrong@example.com", password: "password123" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Incorrect email.");
  });

  it("should fail login with incorrect password", async () => {
    const user = {
      id: 1,
      email: "test@example.com",
      password: await bcrypt.hash("password123", 10),
    };

    User.findOne.mockResolvedValue(user);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Incorrect password.");
  });
});
