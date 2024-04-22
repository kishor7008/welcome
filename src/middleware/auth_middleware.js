const jwt = require("jsonwebtoken");
const { sendResponse } = require("../helpers/Response");
const { Message } = require("../helpers/Messages");
const UserModel = require("../models/UserModel");
const secretKey = process.env.SECRET_KEY;

exports.GenerateToken = (id) => {
  try { 
    const token = jwt.sign({ id: id }, secretKey, { expiresIn: '48h' });
    return token;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.ValidateToken = async (req, res, next) => {
  try {
    let isStaff = false;
    const token = req.headers.authorization;
    console.log(token)
    if (!token) return sendResponse(res, 401, null, Message.TOKEN_MISSING);
    const decodedToken = jwt.verify(token, secretKey);
    let user = await UserModel.findById(decodedToken.id).select(
      "_id name mobile email"
    );
     
    if (!user) {
      user = await Staff.findById(decodedToken.id).populate([
        {
          path: "role",
          select: "roleName",
        },
      ]);
      isStaff = true;

    }
    req.meta = user;
    req.meta.isStaff = isStaff;
    next();
  } catch (err) {
    console.log(err);
    sendResponse(res, 500, null, err.message);
  }
};
