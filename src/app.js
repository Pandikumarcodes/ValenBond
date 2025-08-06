const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/user/data", userAuth, (req, res) => {
  res.send("User Data send ");
});
app.post("/user/data", userAuth, (req, res) => {
  res.send("Post Data send ");
});
app.delete("/user/data", userAuth, (req, res) => {
  res.send(" delete the Data  ");
});
app.listen(7498, () => {
  console.log("server is sucussfully listining running");
});
