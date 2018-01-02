
import { AsyncStorage } from 'react-native';

import httpRequest from '../helpers/requestBuilder';
export const LOGIN = 'LOGIN';
export const LOGGING = 'LOGGING';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';


export const REGISTER = 'REGISTER';
export const REGISTING = 'REGISTING';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';


export const login = (email, password) => async (dispatch) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password,
      email,
    }),
  };
  dispatch({
    type: LOGGING,
  });
  try {
    const response = await httpRequest('/users/login', options);
    if (response.success) {
      AsyncStorage.setItem('jwt', response.token);
      AsyncStorage.setItem('username', response.info.username);
      AsyncStorage.setItem('email', response.info.email);
      AsyncStorage.setItem('name', response.info.name);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response,
      });
    } else {
      dispatch({
        type: LOGIN_FAIL,
        payload: response,
      });
    }
  } catch (e) {
    dispatch({
      type: LOGIN_FAIL,
      payload: {
        success: false,
        msg: e.toString(),
      },
    });
  }
};

export const register = (email, username, password) => async (dispatch) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password,
      email,
      username,
    }),
  };
  dispatch({
    type: REGISTING,
  });
  try {
    const response = await httpRequest('/users/register', options);
    if (response.success) {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: {
          password,
          email,
          username,
        },
      });
    } else {
      dispatch({
        type: REGISTER_FAIL,
        payload: response,
      });
    }
  } catch (e) {
    dispatch({
      type: REGISTER_FAIL,
      payload: {
        success: false,
        msg: e.toString(),
      },
    });
  }
};
