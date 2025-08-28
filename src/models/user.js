const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "Pandi";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password " + value);
        }
      },
    },

    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender Data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url address " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is default user",
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: "1d" });
  return token;
};

userSchema.methods.isValidPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    this.password
  );
  console.log(isPasswordValid);
  return isPasswordValid;
};
// userSchema.methods.validatePassword = async function (inputPassword) {
//   return await bcrypt.compare(inputPassword, this.password);
// };

// userSchema.methods.resetUserPassword = async function (
//   newPassword,
//   confirmPassword
// ) {
//   if (typeof newPassword !== "string" || newPassword.length === 0) {
//     throw new Error("New password must be a non-empty string");
//   }
//   if (newPassword !== confirmPassword) {
//     throw new Error("Passwords do not match");
//   }
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   this.passwordHash = hashedPassword;
//   await this.save();
//   return true;
// };

module.exports = mongoose.model("User", userSchema);
