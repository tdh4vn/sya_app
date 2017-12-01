
import { AsyncStorage } from 'react-native';

import httpRequest from '../helpers/requestBuilder';
export const LOGIN = 'LOGIN';
export const LOGGING = 'LOGGING';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';


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
