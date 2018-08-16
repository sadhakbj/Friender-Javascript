const Validator = require("validator");
const isEmpty = require("./is-empty");

/**
 * Validate the login input fields.
 * @param  {object} data
 */
module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

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

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
