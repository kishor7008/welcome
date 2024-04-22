const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const router = require('./router.js');
const port = process.env.PORT || 8000;

const httpServer = require("http").createServer(app);


async function connectDB() {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo Connected");
  }

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cors());
app.use(morgan('dev'));
app.use('/api/v1', router);


httpServer.listen(port, async () => {
    try {
  
      await connectDB();
      console.log(`Server listening on Port ==> http://localhost:${port}/`);
  
    } catch (err) {
      console.log(`Connection error ===> ${err}`);
    }
  });