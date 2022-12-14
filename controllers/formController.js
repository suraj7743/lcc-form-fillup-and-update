const loginRegister = require("../models/FormModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/Catchasync");
const appError = require("../utils/AppError");
let errors = [];
//load register page
const loadRegister = catchAsync(async (req, res, next) => {
  try {
    res.render("register");
  } catch (error) {
    res.render("errorpage");
  }
});

//need to sigin in and verify the jwt token exists
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
//post the register form
const postForm = async (req, res, next) => {
  try {
    const { name, email, password, confirm_password } = req.body;
    const existEmail = await loginRegister.find({ email });
    const existName = await loginRegister.find({ name });

    if (existName.length > 1) {
      errors.push({
        message: "Enter unique name",
      });
      return res.render("register", {
        errors,
      });
    }
    if (existEmail.length > 1) {
      errors.push({
        message: "Email already exists",
      });
      return res.render("register", {
        errors,
        name,
      });
    }
    if (password.length < 6) {
      errors.push({
        message: "Enter password minimum of 6 length ",
      });
      return res.render("register", {
        errors,
      });
    }
    if (password !== confirm_password) {
      errors.push({
        message: "Password doesnot match",
      });
      return res.render("register", {
        errors,
        name,
        email,
      });
    } else {
      const loginData = loginRegister({
        name,
        email,
        password,
      });

      const formData = await loginData.save();
      let token = jwttoken(formData._id);
      res.cookie("jwt", token, {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: false,
      });

      res.redirect("/student");
      // if (formData) {
      //   const sendmail = mailVerify(
      //     req.body.name,
      //     req.body.email,
      //     formData._id,
      //     req.header("host")
      //   );
      //   console.log(req.header("host"));
      //   res.render("register", {
      //     messageVerify: "Please check your email to verify and login",
      //   });
      // }
    }
  } catch (error) {
    console.log(error.message);
    res.render("errorpage");
  }
};
// const verifyCheck = async (req, res) => {
//   const updateInfo = await loginRegister.updateOne(
//     { _id: req.query.id },
//     { $set: { is_verified: 1 } }
//   );

//   if (updateInfo) {
//     res.redirect("/login");
//   } else {
//     errors.push({
//       message: "First verify your email to login",
//     });
//     res.render("register", {
//       errors,
//     });
//   }
// };
const mailVerify = async (name, email, id, header) => {
  try {
    // create reusable transporter object using the default SMTP transport

    let transporter = nodemailer.createTransport({
      host: process.env.smtpHost,
      port: process.env.smtpPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.smtpUser, // generated ethereal user
        pass: process.env.smtpPassword, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "surajbillionare@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Verification mail ", // Subject line
      text: "Hello world?", // plain text bodygit
      html: `<p>Hii ${name} please click here to <a href="http://${header}/verify?id=${id}">verify</a> Your mail </p>`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loadRegister,
  postForm,
  // verifyCheck,
};
