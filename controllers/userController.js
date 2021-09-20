const passport = require("passport");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.user_create_get = (req, res, next) => {
  res.render("sign-up", { title: "Sign Up" });
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

    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      res.render("sign-up", {
        title: "Sign Up",
        errors: valErrors.array(),
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
      req.login({ username, password }, (error) => {
        if (error) return next(error);
        res.redirect("/");
      });
    });
  },
];
