const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { DateTime } = require("luxon");

const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  title: String,
  text: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
});

MessageSchema.virtual("formatted_date").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Message", MessageSchema);
