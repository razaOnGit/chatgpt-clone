const errorHandler = require("../middelwares/errorMiddleware");
const userModel = require("../models/userModel");
const errorResponse = require("../utils/errroResponse");

// JWT TOKEN
exports.sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken(res);
  res.status(statusCode).json({
    success: true,
    token,
  });
};

//REGISTER
exports.registerContoller = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //existing user check
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.status(200).json({
        success: false,
        message: "Email is already registered"
      });
    }
    const user = await userModel.create({ username, email, password });
    const token = user.getSignedToken(res);
    return res.status(201).json({
      success: true,
      token,
      message: "Registration successful"
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: "Error in registration"
    });
  }
};

//LOGIN
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(200).json({
        success: false,
        message: "Please provide email and password"
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(200).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    const token = user.getSignedToken(res);
    return res.status(200).json({
      success: true,
      token,
      message: "Login successful"
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: "Error in login"
    });
  }
};

//LOGOUT
exports.logoutController = async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({
    success: true,
    message: "Logout Succesfully",
  });
};
