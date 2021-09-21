const { body, validationResult } = require("express-validator");
const Message = require("../models/message");

exports.message_create_get = (req, res, next) => {
  res.redirect("/");
};

exports.message_create_post = [
  body("title", "Message title is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("text", "Message text is required").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    console.log(req.user);
    if (!req.user) return res.redirect("/login");
    const valErrors = validationResult(req);
    Message.find()
      .populate("author")
      .exec((err, messages) => {
        if (err) return next(err);
        if (!valErrors.isEmpty()) {
          res.render("index", {
            title: "The Secret Message Board Club",
            errors: valErrors.array(),
            messages,
          });
          return;
        }

        // VALIDATION PASS
        new Message({
          author: req.user,
          title: req.body.title,
          text: req.body.text,
        }).save((err) => {
          if (err) return next(err);
          res.redirect("/");
        });
      });
  },
];

exports.messages_showcase = (req, res, next) => {
  Message.find()
    .populate("author")
    .exec((err, messages) => {
      res.render("index", {
        title: "The Secret Message Board Club",
        messages,
      });
    });
};

exports.message_delete_get = (req, res, next) => {
  Message.findByIdAndDelete(req.params.messageid, {}, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
