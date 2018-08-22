import React, { Component } from "react";

export default class Landing extends Component {
  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">Friender App</h1>
                <p className="lead">
                  {" "}
                  Create a developer profile/portfolio, share posts and get help
                  from other developers
                </p>
                <hr />
                <a to="/register" className="btn btn-lg btn-info mr-2">
                  Sign Up
                </a>
                <a to="/login" className="btn btn-lg btn-primary">
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
