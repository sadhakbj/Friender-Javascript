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
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

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
 * @route GET api/profile/all
 * @desc List all the profiles
 * @access Public
 */
routes.get("/all", (request, response) => {
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        return response.status(404).json({
          error: "There are no profiles found"
        });
      }
      return response.json(profiles);
    })
    .catch(error =>
      response.status(500).json({
        message: "Something went wrong"
      })
    );
});

/**
 * @route GET api/profile/handle/:handle
 * @desc Get profile by handle
 * @access Public
 */
routes.get("/handle/:handle", (request, response) => {
  Profile.findOne({ handle: request.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        return response.status(404).json({
          no_profile: "profile not found"
        });
      }
      return response.json(profile);
    })
    .catch(error => response.status(500).json(error));
});

/**
 * @route GET api/profile/user/:user_id
 * @desc Get profile by user id
 * @access Public
 */
routes.get("/user/:user_id", (request, response) => {
  Profile.findOne({ user: request.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        return response.status(404).json({
          no_profile: "Profile not found"
        });
      }
      return response.json(profile);
    })
    .catch(error =>
      response.status(500).json({
        profile: "Profile not found"
      })
    );
});

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

/**
 * @route POST api/experience
 * @desc Add experience to profile
 * @access Private
 */
routes.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const { errors, isValid } = validateExperienceInput(request.body);

    if (!isValid) {
      return response.status(400).json(errors);
    }

    Profile.findOne({ user: request.user.id }).then(profile => {
      const experience = {
        title: request.body.title,
        company: request.body.company,
        location: request.body.location,
        from: request.body.from,
        to: request.body.to,
        current: request.body.current,
        description: request.body.description
      };

      profile.experience.unshift(experience);
      profile.save().then(profile => response.json(profile));
    });
  }
);

/**
 * @route POST api/education
 * @desc Add education to profile
 * @access Private
 */
routes.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const { errors, isValid } = validateEducationInput(request.body);

    if (!isValid) {
      return response.status(400).json(errors);
    }

    Profile.findOne({ user: request.user.id }).then(profile => {
      const education = {
        school: request.body.school,
        degree: request.body.degree,
        field_of_study: request.body.field_of_study,
        from: request.body.from,
        to: request.body.to,
        current: request.body.current,
        description: request.body.description
      };

      profile.education.unshift(education);
      profile.save().then(profile => response.json(profile));
    });
  }
);

/**
 * @route DELETE api/profile/education/:experience_id
 * @desc Remove specific experience
 * @access Private
 */
routes.delete(
  "/experience/:experience_id",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    Profile.findOne({ user: request.user.id }).then(profile => {
      const index = profile.experience
        .map(item => item.id)
        .indexOf(request.params.experience_id);

      profile.experience.splice(index, 1);

      profile
        .save()
        .then(profile => {
          return response.json(profile);
        })
        .catch(error => {
          return response.status(500).json(error);
        });
    });
  }
);

/**
 * @route DELETE api/profile/education/:education_id
 * @desc Remove specific education
 * @access Private
 */
routes.delete(
  "/education/:education_id",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    Profile.findOne({ user: request.user.id }).then(profile => {
      const index = profile.education
        .map(item => item.id)
        .indexOf(request.params.education_id);

      profile.education.splice(index, 1);

      profile
        .save()
        .then(profile => {
          return response.json(profile);
        })
        .catch(error => {
          return response.status(500).json(error);
        });
    });
  }
);

/**
 * @route DELETE api/profile
 * @desc Remove user and profile
 * @access Private
 */
routes.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    Profile.findOneAndRemove({ user: request.user.id }).then(() => {
      User.findOneAndRemove({ _id: request.user.id }).then(() =>
        response.json({
          message: "User is deleted"
        })
      );
    });
  }
);

module.exports = routes;
