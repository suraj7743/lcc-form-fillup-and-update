const FormModel = require("../models/FormModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
    // const passwordDecrypt = bcrypt.compare(req.body);

    const userData = await FormModel.findOne({ name: req.body.name });
    if (userData != null) {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        userData.password
      );

      if (passwordMatch) {
        const checkVerify = await FormModel.findOne(
          { name: req.body.name },
          { is_verified: 1 }
        );

        if (checkVerify != null) {
          const token = jwt.sign(
            {
              id: userData._id,
              email: userData.email,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "90d",
            }
          );
          res.cookie("token", token, {
            httpOnly: true,
          });
          res.redirect("/student");
        } else {
          errors.push({
            message: "First Verify your email ",
          });
          res.render("login", {
            errors,
          });
        }
        // const token = await tokenSignIn(userData._id, userData.email);
        // console.log(token);
        // req.headers.authorization = token;
        // console.log(req.headers.authorization);
      } else {
        res.render("login", {
          invalidLogin: "password doesnot match Sorry 😔",
        });
      }
    } else {
      res.render("login", {
        invalidLogin: "Invalid login.. enter correct username and password",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loginpage,
  postLogin,
};
