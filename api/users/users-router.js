const router = require("express").Router();
const Users = require("./users-model");
const { restricted } = require("../auth/auth-middleware");

router.get("/", restricted, (req, res, next) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(() => {
      next({ status: 401, message: "You shall not pass!" });
    });
});

module.exports = router;
