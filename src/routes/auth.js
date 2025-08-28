const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  validateSignupData,
  // validateResetPassword,
} = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    // const salt = await bcrypt.genSalt(10);
    // const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = await user.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      // expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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

// authRouter.patch("/resetPassword", userAuth, async (req, res) => {
//   try {
//     validateResetPassword(req);

//     const { newPassword, confirmPassword } = req.body;

//     const loggedInUser = req.user;
//     const success = await loggedInUser.resetUserPassword(
//       newPassword,
//       confirmPassword
//     );

//     await loggedInUser.save();
//     if (!success) {
//       return res.status(400).json({ error: "Passwords do not match" });
//     }

//     const token = await loggedInUser.getJWT();
//     res.cookie("token", token, {
//       expires: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
//       httpOnly: true,
//     });

//     res.json({ message: "Your password changed successfully." });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

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
