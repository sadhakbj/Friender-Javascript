/**
 * Check if the value is empty or not. Checks for string, object.
 * @param  {} value
 */
const isEmpty = value => {
  return (
    value === undefined ||
    value === null ||
    (typeof value == "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

module.exports = isEmpty;
