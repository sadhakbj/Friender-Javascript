/** Express router providing user related routes.
 * @module routes/api/users
 * @requires express
 */
const express = require("express");
const gravatar = require("gravatar");
const routes = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

/**
 * Models.
 */
const User = require("../../models/User");

/**
 * @route GET api/users/tests
 * @desc Test user routes
 * @access Public
 */
routes.get("/tests", (request, response) => {
  return response.json({
    message: "Users are working on"
  });
});

/**
 * @route GET api/users/register
 * @desc Register the user.
 * @access Public
 */
routes.post("/register", (request, response) => {
  const { errors, isValid } = validateRegisterInput(request.body);

  if (!isValid) {
    return response.status(422).json({
      errors
    });
  }

  const user = User.findOne({
    email: request.body.email
  }).then(user => {
    if (user) {
      return response.status(400).json({
        email: "Email aready exists"
      });
    } else {
      const avatar = gravatar.url(request.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      const newUser = new User({
        name: request.body.name,
        email: request.body.email,
        avatar,
        password: request.body.password
      });

      bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(newUser.password, salt, (error, hash) => {
          if (error) throw error;
          newUser.password = hash;
          newUser
            .save()
            .then(user => response.json(user))
            .catch(error => console.log(error));
        });
      });
    }
  });
});

/**
 * @route GET api/users/login
 * @desc Login to the system. (Returns JWT Token)
 * @access Public
 */
routes.post("/login", (request, response) => {
  const { errors, isValid } = validateLoginInput(request.body);

  if (!isValid) {
    return response.status(422).json({
      errors
    });
  }

  const { email, password } = request.body;

  User.findOne({
    email
  }).then(user => {
    if (!user) {
      return response.status(404).json({
        message: "User Not found"
      });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const { id, name, avatar } = user;

        const payload = {
          id,
          name,
          avatar
        };

        jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (error, token) => {
          response.json({
            success: true,
            token: `Bearer ${token}`
          });
        });
      } else {
        return response.status(400).json({
          message: "Login failed"
        });
      }
    });
  });
});

/**
 * @route GET api/users/current-user
 * @desc Gets the current login user.
 * @access Public
 */
routes.get(
  "/current-user",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const { id, name, avatar, email } = request.user;
    response.json({
      id,
      name,
      email,
      avatar
    });
  }
);

module.exports = routes;
