/** Express router providing profile related routes.
 * @module routes/api/profile
 * @requires express
 */

const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

/**
 * Load Models
 */
const Profile = require("../../models/Profile");
const User = require("../../models/User");

const validateProfileInput = require("../../validation/profile");

/**
 * @route GET api/profile/tests
 * @desc Test post routes
 * @access Public
 */
routes.get("/tests", (request, response) => {
  return response.json({
    message: "Profile are working on",
    status: 200
  });
});

/**
 * @route GET api/profile
 * @desc Get current user's profile
 * @access Private
 */
routes.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const errors = {};

    Profile.findOne({
      user: request.user.id
    })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.no_profile = "Profile not found.";
          return response.status(404).json(errors);
        }
        return response.json(profile);
      })
      .catch(error => response.status(500).json(error));
  }
);

/**
 * @route POST api/profile
 * @desc Post / store current user's profile
 * @access Private
 */
routes.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const { errors, isValid } = validateProfileInput(request.body);

    if (!isValid) {
      return response.status(400).json(errors);
    }

    const profileFields = {};
    profileFields.user = request.user.id;
    if (request.body.handle) profileFields.handle = request.body.handle;
    if (request.body.company) profileFields.company = request.body.company;
    if (request.body.website) profileFields.website = request.body.website;
    if (request.body.location) profileFields.location = request.body.location;
    if (request.body.bio) profileFields.bio = request.body.bio;
    if (request.body.status) profileFields.status = request.body.status;
    if (request.body.github_user_name)
      profileFields.github_user_name = request.body.github_user_name;

    if (typeof request.body.skills !== "undefined") {
      profileFields.skills = request.body.skills.split(",");
    }

    profileFields.social = {};

    if (request.body.youtube)
      profileFields.social.youtube = request.body.youtube;

    if (request.body.facebook)
      profileFields.social.facebook = request.body.facebook;

    if (request.body.twitter)
      profileFields.social.twitter = request.body.twitter;

    if (request.body.instagram)
      profileFields.social.instagram = request.body.instagram;

    if (request.body.linkedin)
      profileFields.social.linkedin = request.body.linkedin;

    Profile.findOne({
      user: request.user.id
    }).then(profile => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: request.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => response.json(profile));
      } else {
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "Handle already exists in system";
            response.status(400).json(errors);
          }

          new Profile(profileFields)
            .save()
            .then(profile => response.json(profile));
        });
      }
    });
  }
);

module.exports = routes;
