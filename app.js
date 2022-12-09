const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv/config");
//to import routes posts
const postsRoute = require("./routes/posts");
const authRoute = require("./routes/auth");

app.use(bodyParser.json());
app.use("/api/post", postsRoute);
app.use("/api/user", authRoute);

//connecting to database
mongoose.connect(process.env.DB_CONNECTOR, () => {
  console.log("DB is connected...");
});

//connecting to server and that server is on and working
app.listen(3007, () => {
  console.log("server is running...");
});
