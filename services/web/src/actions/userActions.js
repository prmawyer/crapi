/*
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import actionTypes from "../constants/actionTypes";

export const logInUserAction = ({ email, password, callback }) => {
  return {
    type: actionTypes.LOG_IN,
    payload: { email, password, callback },
  };
};

export const unlockUserAction = ({ email, code, callback }) => {
  console.log("unlockUserAction", email, code, callback);
  return {
    type: actionTypes.UNLOCK_USER,
    payload: { email, code, callback },
  };
};

export const unlockRedirectUserAction = ({ email, message, callback }) => {
  console.log("unlockRedirectUserAction", email, message, callback);
  return {
    type: actionTypes.UNLOCK_USER_REDIRECT,
    payload: { email, message, callback },
  };
};

export const signUpUserAction = ({
  name,
  email,
  number,
  password,
  callback,
}) => {
  return {
    type: actionTypes.SIGN_UP,
    payload: { name, email, number, password, callback },
  };
};

// clear store data and local storage and log user out
export const logOutUserAction = ({ callback }) => {
  return {
    type: actionTypes.LOG_OUT,
    payload: { callback },
  };
};

export const validateAccessTokenAction = () => {
  console.log("validateAccessTokenAction action");
  return {
    type: actionTypes.VALIDATE_ACCESS_TOKEN,
  };
};

export const invalidSessionAction = () => {
  return {
    type: actionTypes.INVALID_SESSION,
  };
};

export const forgotPasswordAction = ({ email, callback }) => {
  return {
    type: actionTypes.FORGOT_PASSWORD,
    payload: { email, callback },
  };
};

export const verifyOTPAction = ({ otp, email, password, callback }) => {
  return {
    type: actionTypes.VERIFY_OTP,
    payload: { otp, email, password, callback },
  };
};

export const resetPasswordAction = ({
  email,
  accessToken,
  password,
  callback,
}) => {
  return {
    type: actionTypes.RESET_PASSWORD,
    payload: { email, accessToken, password, callback },
  };
};

export const getServicesAction = ({ accessToken, callback, ...data }) => {
  return {
    type: actionTypes.GET_SERVICES,
    payload: { accessToken, callback, ...data },
  };
};

export const changeEmailAction = ({ accessToken, callback, ...data }) => {
  return {
    type: actionTypes.CHANGE_EMAIL,
    payload: { accessToken, callback, ...data },
  };
};

export const verifyTokenAction = ({ accessToken, callback, ...data }) => {
  return {
    type: actionTypes.VERIFY_TOKEN,
    payload: { accessToken, callback, ...data },
  };
};
