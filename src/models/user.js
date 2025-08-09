const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "PandiMernStack@newDeveloper";

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
      minlength: 8,
      // validate(value) {
      //   if (!validator.isStrongPassword(value)) {
      //     throw new Error("Enter a strong password " + value);
      //   }
      // },
    },
    // passwordHash: {
    //   type: String,
    //   required: true,
    //   validate(value) {
    //     if (typeof value !== "string" || !validator.isStrongPassword(value)) {
    //       throw new Error("Enter a strong password");
    //     }
    //   },
    // },
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
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
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

userSchema.methods.validatepassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

userSchema.methods.resetUserPassword = async function (
  newPassword,
  confirmPassword
) {
  if (typeof newPassword !== "string" || newPassword.length === 0) {
    throw new Error("New password must be a non-empty string");
  }
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  this.passwordHash = hashedPassword;
  // await this.save();
  return true;
};

module.exports = mongoose.model("User", userSchema);
