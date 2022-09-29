const express = require("express");
const router = express();
const formController = require("../controllers/formController");
router.get("/", async (req, res) => {
  res.redirect("/register");
});
router.get("/register", formController.loadRegister);
router.post("/register", formController.postForm);
// router.get("/verify", formController.verifyCheck);
module.exports = router;
