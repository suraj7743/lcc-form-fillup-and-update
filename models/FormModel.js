const mongoose = require("mongoose");
const validatar = require("validator");
const bcrypt = require("bcrypt");
const FormSchema = mongoose.Schema(
  {
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

    is_verified: {
      type: Number,
      default: 0,
    },
    passwordChangedDate: Date,
  },
  {
    timestamps: true,
  }
);
FormSchema.pre("save", function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
    this.passwordChangedDate = Date.now() - 1000;
  } else {
    return next();
  }
});

module.exports = loginRegister = mongoose.model("studentForm", FormSchema);
