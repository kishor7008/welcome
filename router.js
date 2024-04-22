const express = require("express");
const app = express();

const UserRoutes = require("./src/routes/UserRoutes.js")

app.use("/user", UserRoutes);



module.exports = app;
