const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validEditProfileDate } = require("../utils/validation");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    res.send(user);
  } catch (err) {
    res.status(400).send("error : " + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validEditProfileDate(req)) {
      throw new Error("Invalid Edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName} your profile updated SuccessFully`,
      data: {
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        about: loggedInUser.about,
        emailId: loggedInUser.emailId,
      },
    });
  } catch (err) {
    res.status(400).send("error : " + err.message);
  }
});

module.exports = { profileRouter };
