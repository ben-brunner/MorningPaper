const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: String,
  userName: String,
  password: String,
  token: String,
  lang: String,
});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;