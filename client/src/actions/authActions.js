import { GET_ERRORS } from "./types";
import axios from "axios";

/**
 * Register
 */
export const registerUser = (data, history) => dispatch => {
  axios
    .post("/api/users/register", data)
    .then(response => history.push("/login"))
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
};
