const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
requestRouter.post("/sendConnection", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " is Logging");
  } catch (err) {
    res.status(400).send("error : " + err.message);
  }
});
module.exports = { requestRouter };
