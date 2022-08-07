const studentModel = require("../models/studentModel");
const submitMainPage = async (req, res) => {
  try {
    res.render("submitForm");
  } catch (error) {
    res.status(400).json({
      status: "failure",
      message: error,
    });
  }
};
let errors = [];
const postSubmitDetails = async (req, res) => {
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any
  const {
    studentName,
    imageemoji,
    studentFrom,
    studentCharacter,
    studentHeight,
    studentRollno,
    studentGrade,
    studentDescription,
    studentimage,
    studentClass,
  } = req.body;
  const existName = await studentModel.find({
    studentName,
  });
  if (existName.length === 1) {
    errors.push({
      message: "Enter unique name please ",
    });

    return res.render("submitForm", {
      errors,
      imageemoji,
      studentFrom,
      studentCharacter,
      studentHeight,
      studentRollno,
      studentGrade,
      studentDescription,
      studentClass,
    });
  }
  if (studentName.length < 3) {
    errors.push({
      message: "Name must be at least three character long  ",
    });

    return res.render("submitForm", {
      errors,
      imageemoji,
      studentFrom,
      studentCharacter,
      studentHeight,
      studentRollno,
      studentGrade,
      studentDescription,
      studentClass,
    });
  }

  const studentDescriptionArray = studentDescription.split(" ").length;
  if (studentDescriptionArray <= 20) {
    errors.push({
      message: "Description must be 20 word long ",
    });
    return res.render("submitForm", {
      errors,
      imageemoji,
      studentFrom,
      studentCharacter,
      studentHeight,
      studentRollno,
      studentGrade,
      studentClass,
      studentName,
      studentDescription,
    });
  }
  const studentCharacterArray = studentCharacter.split(" ").length;
  if (studentCharacterArray !== 2) {
    errors.push({
      message: "Character should be exact of two words only ",
    });
    return res.render("submitForm", {
      errors,
      imageemoji,
      studentFrom,
      studentCharacter,
      studentHeight,
      studentRollno,
      studentGrade,
      studentClass,
      studentName,
      studentDescription,
    });
  }

  try {
    const uploadDatabase = new studentModel({
      // studentName: req.body.studentName,
      // imageemoji: req.body.imageemoji,
      // studentFrom: req.body.studentFrom,
      // studentCharacter: req.body.studentCharacter,
      // studentHeight: req.body.studentHeight,
      // studentRollno: req.body.studentRollno,
      // studentGrade: req.body.studentGrade,
      // studentDescription: req.body.studentDescription,
      // studentimage: req.file.path,
      // studentClass: req.body.studentClass,
      studentName,
      imageemoji,
      studentFrom,
      studentCharacter,
      studentHeight,
      studentRollno,
      studentGrade,
      studentDescription,
      studentimage: req.file.path,
      studentClass,
    });
    const data = await uploadDatabase.save();

    if (data) {
      res.redirect("/student");
    } else {
      res.status(200).json({
        status: "success",
        data,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
errors = [];
module.exports = {
  submitMainPage,
  postSubmitDetails,
};
