import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import drawer from './drawer';
import user from './user';
import listDevices from './listDevices';

export default combineReducers({
  form: formReducer,
  drawer,
  user,
  listDevices,
});
