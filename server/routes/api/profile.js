/** Express router providing profile related routes.
 * @module routes/api/profile
 * @requires express
 */

const express = require("express");
const routes = express.Router();

/**
 * @route GET api/posts/tests
 * @desc Test post routes
 * @access Public
 */
routes.get("/tests", (request, response) => {
  return response.json({
    message: "Profile are working on",
    status: 200
  });
});

module.exports = routes;
