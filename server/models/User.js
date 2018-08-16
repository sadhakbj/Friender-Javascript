/** User model providing the schema details.
 * @module models/User
 * @requires mongoose
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Define the user schema.
 */
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);
