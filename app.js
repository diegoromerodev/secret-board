const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sassMiddleware = require("node-sass-middleware");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const flash = require("connect-flash");
require("dotenv").config();
const User = require("./models/user");
const figlet = require("figlet");

const messageRouter = require("./routes/message");
const indexRouter = require("./routes/index");

const app = express();

mongoose.connect(process.env.database);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

const expressSession = require("express-session")({
  secret: "dsdqwdecxc2e23443wdwasdasf,po",
  resave: false,
  saveUninitialized: false,
});

app.use(expressSession);

/*  PASSPORT SETUP  */

const passport = require("passport");

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Wrong credentials" });
      }
      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use((req, res, next) => {
  res.locals.user = req.user;
  figlet(
    "The Secret Message Board Club",
    {
      font: "Standard",
    },
    function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      res.locals.ascii = data;
      next();
    }
  );
});

app.use("/message", messageRouter);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
