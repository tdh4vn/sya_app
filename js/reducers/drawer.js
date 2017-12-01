
import type { Action } from '../actions/types';
import { OPEN_DRAWER, CLOSE_DRAWER } from '../actions/drawer';

const initialState = {
  drawerState: 'closed',
  drawerDisabled: true,
};

export default function (state = initialState, action) {
  if (action.type === OPEN_DRAWER) {
    return {
      ...state,
      drawerState: 'opened',
    };
  }

  if (action.type === CLOSE_DRAWER) {
    return {
      ...state,
      drawerState: 'closed',
    };
  }

  return state;
}
