const Users = require("../users/users-model");

function restricted(req, res, next) {
  if (req.session) {
    next();
  } else {
    next({ status: 401, message: "You shall not pass!" });
  }
}

function checkUsernameFree(req, res, next) {
  Users.findBy({ username: req.body.username })
    .then((user) => {
      if (!user.length) {
        next();
      } else {
        next({ status: 422, message: "Username taken" });
      }
    })
    .catch(next);
}

function checkUsernameExists(req, res, next) {
  Users.findBy({ username: req.body.username })
    .then((user) => {
      if (!user.length) {
        next();
      } else {
        next({ status: 401, message: "Invalid credentials" });
      }
    })
    .catch(next);
}

function checkPasswordLength(req, res, next) {
  if (!req.body.password || req.body.password < 3) {
    next({ status: 422, message: "Password must be longer than 3 chars" });
  } else {
    next();
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};
