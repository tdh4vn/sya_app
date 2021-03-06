import {
  LOGGING,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTING,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from '../actions/user';

const initialState = {
  logging: false,
  msg: '',
  success: false,
  token: '',
  roles: [],
  username: '',
  email: '',
  name: '',
  _id: '',
  registerStatus: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGGING: {
      return {
        logging: true,
        msg: 'Đang đăng nhập',
      };
    }
    case LOGIN_SUCCESS: {
      return {
        logging: false,
        msg: 'Đăng nhập thành công',
        success: true,
        token: action.payload.token,
        roles: action.payload.info.roles,
        username: action.payload.info.username,
        name: action.payload.info.name,
        email: action.payload.info.email,
        _id: action.payload.info._id,
      };
    }
    case LOGIN_FAIL: {
      return {
        logging: false,
        msg: 'Đăng nhập thất bại',
        success: false,
      };
    }

    case REGISTING: {
      return {
        msg: 'Đang đăng kí',
        registerStatus: 1,
      };
    }

    case REGISTER_SUCCESS: {
      return {
        msg: '',
        registerStatus: 2,
      };
    }

    case REGISTER_FAIL: {
      return {
        msg: 'Có lỗi xảy ra, thử lại sau',
        registerStatus: 3,
      };
    }

    default:
      return state;
  }
}
