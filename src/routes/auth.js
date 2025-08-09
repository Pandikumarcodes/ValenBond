const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  validateSignupData,
  validateResetPassword,
} = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await newUser.save();
    res.send("data posted");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(400).json({ error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("invalid credentials");
    }
    const isPasswordValid = await user.validatepassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 360000),
      });
      res.send("Loginn Successfully....");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .send("logout SucessFully");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

authRouter.post("/emailverify", async (req, res) => {
  try {
    const { emailId } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("user not found! please signup");
    }
    if (user) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 5 * 60 * 1000),
        httpOnly: true,
      });
      res.json({ message: "Please reset your password." });
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

authRouter.patch("/resetPassword", userAuth, async (req, res) => {
  try {
    validateResetPassword(req);

    const { newPassword, confirmPassword } = req.body;

    const loggedInUser = req.user;
    const success = await loggedInUser.resetUserPassword(
      newPassword,
      confirmPassword
    );
    console.log(loggedInUser);
    await loggedInUser.save();
    if (!success) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const token = await loggedInUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
      httpOnly: true,
    });

    res.json({ message: "Your password changed successfully." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// authRouter.post("/reset-password", async (req, res) => {
//   try {
//     const { email, oldPassword, newPassword } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) return res.status(400).json({ message: "User not found" });

//     // Check if OLD password is correct
//     const isOldValid = await user.isValidPassword(oldPassword);
//     if (!isOldValid)
//       return res.status(400).json({ message: "Old password is incorrect" });

//     // Update to NEW password
//     user.password = newPassword; // Will be hashed automatically in pre-save hook
//     await user.save();

//     res.json({ message: "Password updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = { authRouter };
