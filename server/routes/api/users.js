/** Express router providing user related routes
 * @module routers/api/users
 * @requires express
 */

const express = require("express");
const routes = express.Router();

/**
 * @route GET api/users/tests
 * @desc Test user routes
 * @access Public
 */
routes.get("/tests", (req, res) => {
  return res.json({
    message: "Users are working on"
  });
});

module.exports = routes;
