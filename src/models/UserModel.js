const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

  firstName: {
    type: String,
    default: null,
    require:true
  },
  lastName: {
    type: String,
    default: null,
    require:true
  },
  email: {
    type: String,
    default: null
  },
  mobile: {
    type: Number,
    default: null
  },
 
  password: {
    type: String,
    default: null,
    require:true
  },


}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);