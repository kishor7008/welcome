const mongoose = require('mongoose');

const OtpSchema = mongoose.Schema({

 email:{
    type: String,
    default: null
 },
 otp:{
    type: Number,
    default: null
 }

}, { timestamps: true });

module.exports = mongoose.model("OTP", OtpSchema);