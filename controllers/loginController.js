const FormModel = require("../models/FormModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//to sign in the jwt token
const jwttoken = (id) => {
  const token = jwt.sign(
    {
      id,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "30d",
    }
  );
  return token;
};

//login page for get method
const loginpage = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    res.render("errorpage");
  }
};
// tokenSignIn = (id, email) => {
//   try {
//     const token = jwt.sign(
//       {
//         id,
//         email,
//       },
//       process.env.JWT_KEY,
//       {
//         expiresIn: "90d",
//       }
//     );
//     return token;
//   } catch (error) {}
// };

//post login to verify
let errors = [];
const postLogin = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await FormModel.findOne({ name });
    if (!user) {
      return res.render("login", {
        invalidLogin: "Enter Valid Username ",
      });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.render("login", {
        invalidLogin: "Password doesnot match 😓",
      });
    }
    const token = jwttoken(user._id);
    req.headers.authorization = token;
    res.redirect("/student");
  } catch (error) {
    console.log(error.message);
    res.render("errorpage");
  }
};

module.exports = {
  loginpage,
  postLogin,
};
