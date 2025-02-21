const express = require("express");
const {
  registerContoller,
  loginController,
  logoutController,
} = require("../controllers/authController");

//router object
const router = express.Router();

//routes
// REGISTER
router.post("/register", registerContoller);

//LOGIN
// router.post("/login", loginController);
router.get("/login", (req, res) => {
  res.send("GET request received at /login - please use POST for login functionality.");
});

//LOGOUT
router.post("/logout", logoutController);

module.exports = router;
