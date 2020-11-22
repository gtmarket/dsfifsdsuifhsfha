
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  id: String,
  username: String,
  email: String,
  password: Number,
  seller: Boolean,
  createdAt: Number,
  status: String,
  verified: Boolean,
  confirmed: Boolean,
  banned: Boolean
});

module.exports = mongoose.model("Users", userSchema);