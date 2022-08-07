const loginRegister = require("../models/FormModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
let errors = [];
//load register page
const loadRegister = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    res.render("errorpage");
  }
};

const postForm = async (req, res) => {
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
      const securepass = await bcrypt.hash(req.body.password, 10);
      const loginData = loginRegister({
        name,
        email,
        password: securepass,
        confirm_password: securepass,
      });
      const formData = await loginData.save();
      if (formData) {
        const sendmail = mailVerify(
          req.body.name,
          req.body.email,
          formData._id,
          req.header("host")
        );
        console.log(req.header("host"));
        res.render("register", {
          messageVerify: "Please check your email to verify and login",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.render("errorpage");
  }
};
const verifyCheck = async (req, res) => {
  const updateInfo = await loginRegister.updateOne(
    { _id: req.query.id },
    { $set: { is_verified: 1 } }
  );

  if (updateInfo) {
    res.redirect("/login");
  } else {
    errors.push({
      message: "First verify your email to login",
    });
    res.render("register", {
      errors,
    });
  }
};
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
  verifyCheck,
};
