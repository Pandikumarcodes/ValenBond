const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is Not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address ");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password ");
  }
};
const validEditProfileDate = (req) => {
  const allowedEditProfileDate = ["gender", "about"];
  const isEditAllowed = Object.keys(req.body).every((field) => {
    return allowedEditProfileDate.includes(field);
  });
  return isEditAllowed;
};

const validateResetPassword = (req) => {
  const allowedFields = ["newPassword", "confirmPassword"];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );
  if (!isEditAllowed) {
    throw new Error("Invalid fields in request");
  }

  const { newPassword, confirmPassword } = req.body;

  if (typeof newPassword !== "string" || typeof confirmPassword !== "string") {
    throw new Error("Passwords must be strings");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Enter a strong password");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
};

module.exports = {
  validateSignupData,
  validEditProfileDate,
  validateResetPassword,
};
