const Validator = require("validator");
const isEmpty = require("./is-empty");

/**
 * Validate the register input fields.
 * @param  {object} data
 */
module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password_confirmation = !isEmpty(data.password_confirmation)
    ? data.password_confirmation
    : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Please provide valid email address.";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 and 40 characters";
  }

  if (Validator.isEmpty(data.password_confirmation)) {
    errors.password_confirmation = "Password confirmation field is required";
  }

  if (!Validator.equals(data.password, data.password_confirmation)) {
    errors.password_confirmation =
      "Password and confirm password does not match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
