const User = require("../models/UserModel");
const { sendResponse } = require("../helpers/Response");
const bcrypt = require('bcrypt');
const { validateEmptyFields, validateEmailFormat, validateMobileFormat } = require('../helpers/validation');
const OTP =require("../models/OtpModel");
const jwt=require('jsonwebtoken')
exports.CreateUser = async (req, res) => {
  try {
    let { firstName, lastName, email, mobile, password } = req.body;

    // Empty fields validation
    if (validateEmptyFields([firstName, lastName, email, mobile, password])) {
      return sendResponse(res, 400, null, "All fields are required");
    }

    // Email validation
    if (!validateEmailFormat(email)) {
      return sendResponse(res, 400, null, "Invalid email format");
    }

    // Mobile number validation
    if (!validateMobileFormat(mobile)) {
      return sendResponse(res, 400, null, "Mobile number should contain only numbers");
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // Create user
    let user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword
    });

    // Exclude password field from the response
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile
    };

    sendResponse(res, 200, userData);
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, null, err.message);
  }
};




exports.UserLogin = async (req, res) => {
  try {

    sendResponse(res, 200,"Login successful!");
  } catch (err) {
    console.log(err);
    sendResponse(res, 500, null, err.message);
  }
};




exports.SendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation: Check if email is provided
    if (!email) {
      return sendResponse(res, 400, null, "Email is required");
    }

    // Check if email exists in OTP collection
    let isMailPresent = await OTP.findOne({ email });

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    if (isMailPresent) {
      // If email exists, update OTP
      await OTP.findByIdAndUpdate(isMailPresent._id, { otp });
    } else {
      // If email doesn't exist, create a new document
      await OTP.create({ email, otp });
    }

    sendResponse(res, 200,otp,"OTP sent successfully!");
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, null, err.message);
  }
};

exports.VerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation: Check if email and OTP are provided
    if (!email || !otp) {
      return sendResponse(res, 400, null, "Email and OTP are required");
    }

    // Check if OTP exists for the provided email
    const otpDoc = await OTP.findOne({ email });

    if (!otpDoc) {
      return sendResponse(res, 404, null, "OTP not found for this email");
    }

    // Check if provided OTP matches the stored OTP
    if (otpDoc.otp !== otp) {
      return sendResponse(res, 400, null, "Invalid OTP");
    }

    // If OTP is valid, you can proceed with further actions

    sendResponse(res, 200, "OTP verified successfully!");
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, null, err.message);
  }
};



exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation: Check if email and password are provided
    if (!email || !password) {
      return sendResponse(res, 400, null, "Email and password are required");
    }

    // Check if user exists with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 404, null, "User not found");
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendResponse(res, 401, null, "Invalid password");
    }

    // If email and password are correct, generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Your JWT secret key
      { expiresIn: '1h' } // Token expiration time
    );

    sendResponse(res, 200, { token });
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, null, err.message);
  }
};