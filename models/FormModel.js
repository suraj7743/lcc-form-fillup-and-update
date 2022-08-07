const mongoose = require("mongoose");
const validatar = require("validator");
const bcrypt = require("bcrypt");
const FormSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    validate: [validatar.isEmail, "please enter valid mail"],
  },

  password: {
    type: String,
    required: true,
  },
  confirm_password: {
    type: String,
    required: true,
  },
  is_verified: {
    type: Number,
    default: 0,
  },
});

module.exports = loginRegister = mongoose.model("studentForm", FormSchema);
