const express = require("express");
const {
  message_create_post,
  message_create_get,
  message_delete_get,
} = require("../controllers/messageController");
const router = express.Router();

router.get("/create", message_create_get);
router.post("/create", message_create_post);
router.get("/:messageid/delete", message_delete_get);

module.exports = router;
