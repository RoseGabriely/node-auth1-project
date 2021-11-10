const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");
const { checkUsernameFree, checkPasswordLength } = require("./auth-middleware");

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

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

module.exports = router;
