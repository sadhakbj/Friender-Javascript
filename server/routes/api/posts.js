/** Express router providing post related routes.
 * @module routes/api/posts
 * @requires express
 */

const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

/**
 * Load all the models
 */
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

/**
 * Validation file
 */
const validatePostInput = require("../../validation/post");

/**
 * @route get api/posts
 * @desc Get list of all the posts
 * @access Public
 */
routes.get("/", (request, response) => {
  Post.find()
    .sort({ created_at: -1 })
    .then(posts => {
      response.json(posts);
    })
    .catch(error => response.status(500).json({ error: "Post not found." }));
});

/**
 * @route get api/posts/:id
 * @desc Get details of the post
 * @access Public
 */
routes.get("/:id", (request, response) => {
  Post.findById(request.params.id)
    .then(post => {
      response.json(post);
    })
    .catch(error => response.status(500).json({ error: "Post not found" }));
});

/**
 * @route POst api/posts
 * @desc Create new post
 * @access Private
 */
routes.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const { errors, isValid } = validatePostInput(request.body);

    if (!isValid) {
      return response.status(400).json(errors);
    }

    const post = new Post({
      text: request.body.text,
      name: request.body.name,
      avatar: request.body.avatar,
      user: request.user.id
    });

    post.save().then(post => {
      response.json(post);
    });
  }
);

/**
 * @route Delete api/posts/:post_id
 * @desc Delete new post
 * @access Private
 */
routes.delete(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    Profile.findOne({ user: request.user.id }).then(profile => {
      Post.findById(request.params.post_id)
        .then(post => {
          if (post.user.toString() !== request.user.id) {
            return response.status(401).json({
              message: "Not authorized to perform this action"
            });
          }
          post.remove().then(() =>
            response.json({
              success: "Deleted the post"
            })
          );
        })
        .catch(error => response.status(500).json(error));
    });
  }
);

/**
 * @route Post api/posts/like/:post_id
 * @desc Like the post by id.
 * @access Private
 */
routes.post(
  "/:post_id/like",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    Profile.findOne({ user: request.user.id }).then(profile => {
      Post.findById(request.params.post_id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === request.user.id)
              .length > 0
          ) {
            return response
              .status(400)
              .json({ message: "Already liked this post" });
          }

          post.likes.unshift({ user: request.user.id });

          post.save().then(post => response.json(post));
        })
        .catch(error => response.status(500).json({ error: "Could not like" }));
    });
  }
);

/**
 * @route Post api/posts/like/:post_id
 * @desc Unlike post
 * @access Private
 */
routes.post(
  "/:post_id/unlike",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    Profile.findOne({ user: request.user.id }).then(profile => {
      Post.findById(request.params.post_id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === request.user.id)
              .length === 0
          ) {
            return response
              .status(400)
              .json({ message: "You have no liked this post yet" });
          }
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(request.user.id);

          post.likes.splice(removeIndex, 1);

          post.save().then(post => {
            return response.json(post);
          });
        })
        .catch(error =>
          response.status(500).json({ error: "Could not unlike" })
        );
    });
  }
);

/**
 * @route Post api/posts/:post_id/comment
 * @desc Unlike post
 * @access Private
 */
routes.post(
  "/:id/comment",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const { errors, isValid } = validatePostInput(request.body);

    if (!isValid) {
      return response.status(400).json(errors);
    }

    Post.findById(request.params.id)
      .then(post => {
        const newComment = {
          text: request.body.text,
          name: request.body.name,
          avatar: request.body.avatar,
          user: request.user.id
        };

        post.comments.unshift(newComment);

        post.save().then(post => response.json(post));
      })
      .catch(err =>
        response.status(404).json({ postnotfound: "No post found" })
      );
  }
);

/**
 * @route Delete api/posts/:post_id/comment
 * @desc Unlike post
 * @access Private
 */
routes.delete(
  "/:id/comment/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    Post.findById(request.params.id)
      .then(post => {
        if (
          post.comments.filter(
            comment => comment._id.toString() === request.params.comment_id
          ).length === 0
        ) {
          return response
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(request.params.comment_id);

        post.comments.splice(removeIndex, 1);

        post.save().then(post => response.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = routes;
