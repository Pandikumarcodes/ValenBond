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
module.exports = { validateSignupData };
