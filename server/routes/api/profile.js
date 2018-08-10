/** Express router providing profile related routes
 * @module routers/api/profile
 * @requires express
 */

const express = require("express");
const routes = express.Router();

/**
 * @route GET api/posts/tests
 * @desc Test post routes
 * @access Public
 */
routes.get("/tests", (req, res) => {
  return res.json({
    message: "Profile are working on"
  });
});

module.exports = routes;
