const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: String,
  last_name: String,
  username: { type: String, required: true },
  password: { type: String, required: true },
  membership: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
});

UserSchema.virtual("full_name").get(() => {
  return this.first_name + " " + this.last_name;
});

module.exports = mongoose.model("User", UserSchema);
