const passport = require("passport");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.user_login_get = (req, res, next) => {
  if (req.user) return res.redirect("/logout");
  res.render("login_form", { title: "Log In", errors: req.flash("error") });
};

exports.user_login_post = [
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
    failureFlash: true,
  }),
];

exports.user_create_get = (req, res, next) => {
  res.render("sign_up", { title: "Sign Up" });
};

exports.user_create_post = [
  body("first_name", "First name is required and up to 15 chars")
    .trim()
    .isLength({ min: 1, max: 15 })
    .escape(),
  body("last_name", "Last name is required and up to 15 chars")
    .trim()
    .isLength({ min: 1, max: 15 })
    .escape(),
  body("username", "Username must be an email").trim().isEmail().escape(),
  body(
    "password",
    "Password is required and up to 15 chars and must be alphanumeric"
  )
    .trim()
    .isLength({ min: 1, max: 15 })
    .isAlphanumeric()
    .escape(),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords must match");
    }
    return true;
  }),
  (req, res, next) => {
    const {
      first_name: firstName,
      last_name: lastName,
      username,
      password,
    } = req.body;

    User.findOne({ username }).exec((err, user) => {
      const duplicateUser = [];
      if (user) duplicateUser.push("Username is taken");
      const valErrors = validationResult(req);
      if (!valErrors.isEmpty() || duplicateUser.length) {
        res.render("sign_up", {
          title: "Sign Up",
          errors: valErrors.array().concat(duplicateUser),
          user: { firstName, lastName, username },
        });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPass = bcrypt.hashSync(password, salt);
      const newUser = new User({
        first_name: firstName,
        last_name: lastName,
        username,
        password: hashedPass,
      });

      newUser.save((err) => {
        if (err) return next(err);
        passport.authenticate("local")(req, res, function () {
          res.redirect("/");
        });
      });
    });
  },
];

exports.user_logout_get = (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  res.render("log_out", { title: "Log Out" });
};

exports.user_delete_session_get = (req, res, next) => {
  req.logout();
  res.redirect("/");
};

exports.user_membership_get = (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  res.render("membership_status", { title: "Upgrade Your Membership" });
};

exports.user_membership_post = (req, res, next) => {
  if (!req.user.id) return res.redirect("/login");
  User.findByIdAndUpdate(req.user.id, { membership: true }, {}, (err, doc) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
