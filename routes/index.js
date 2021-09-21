const express = require("express");
const { messages_showcase } = require("../controllers/messageController");
const {
  user_login_get,
  user_login_post,
  user_create_get,
  user_create_post,
  user_logout_get,
  user_delete_session_get,
  user_membership_get,
  user_membership_post,
} = require("../controllers/userController");
const router = express.Router();

/* GET home page. */
router.get("/", messages_showcase);

router.get("/login", user_login_get);
router.post("/login", user_login_post);
router.get("/signup", user_create_get);
router.post("/signup", user_create_post);
router.get("/membership", user_membership_get);
router.post("/membership", user_membership_post);
router.get("/logout", user_logout_get);
router.get("/log-me-out", user_delete_session_get);

module.exports = router;
