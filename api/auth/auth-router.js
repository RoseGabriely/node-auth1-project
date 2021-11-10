const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");
const {
  checkUsernameFree,
  checkPasswordLength,
  checkUsernameExists,
} = require("./auth-middleware");

router.post(
  "/register",
  checkUsernameFree,
  checkPasswordLength,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const hash = bcrypt.hashSync(password, 6);
      const newUser = { username, password: hash };
      const user = await Users.add(newUser);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/login", checkUsernameExists, (req, res, next) => {
  try {
    if (bcrypt.compareSync(req.body.password, req.user.password)) {
      req.session.user = req.user;
      res.status(200).json({ message: `Welcome ${req.user.username}!` });
    } else {
      res.status(401).json({ message: `Invalid credentials` });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res, next) => {
  if (!req.session.user) {
    res.status(200).json({ message: "no session" });
  } else {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ message: "logged out" });
      }
    });
  }
});

module.exports = router;
