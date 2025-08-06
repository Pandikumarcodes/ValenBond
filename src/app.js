const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  try {
    throw new Error("sdcse");
  } catch (err) {
    res.status(500).send("something wenting wrong");
  }

  res.send("User Data send ");
});
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});

app.listen(7498, () => {
  console.log("server is sucussfully listining running");
});
