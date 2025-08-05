const express = require("express");
const app = express();
app.use("/hello", (req, res) => {
  res.send("Hello from the server");
});
app.use("/123", (req, res) => {
  res.send("123");
});
app.listen(7498, () => {
  console.log("server is sucussfully listining running");
});
