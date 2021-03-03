import axios from 'axios';
// import { useHistory } from "react-router-dom";
// Action types

export const LOGIN_USER_FETCH = 'auth/LOGIN_USER_FETCH';
export const LOGIN_USER_SUCCESS = 'auth/LOGIN_USER_SUCCESS';
export const LOGIN_USER_ERROR = 'auth/LOGIN_USER_ERROR';

export const LOAD_USER = 'auth/LOAD_USER';
export const LOAD_USER_SUCCESS = 'auth/LOAD_USER_SUCCESS';
export const LOAD_USER_ERROR = 'auth/LOAD_USER_ERROR';

export const LOG_OUT_USER = 'auth/LOG_OUT_USER';

// export const getAuthDetails = (val, history) => async dispatch => {
//   try {
//     const user = await axios.get('/api/v1/users', {
//       email: val.email,
//       password: val.password
//     });
//     console.log({ user });
//     // dispatch({
//     //   type: LOGIN_USER,
//     //   payload: user.data.data,
//     // });
//   } catch (error) {
//     console.log(error);
//   }
// };

// Reducer
const initialState = {
  userLoading: false,
  user: JSON.parse(localStorage.getItem('user')) || null,
  userLoadingError: false,
  isAuthenticated: !!JSON.parse(localStorage.getItem('user')),
  token: localStorage.getItem('token')
};

// Actions
export const login = (val, history) => async dispatch => {
  try {
    dispatch({ type: LOGIN_USER_FETCH });
    const user = await axios.post('/api/v1/users/login', {
      email: val.email,
      password: val.password
    });
    console.log('res', user);
    console.log('Bearer ' + user.data.token);
    const token = 'Bearer ' + user.data.token;

    axios.defaults.headers.common['Authorization'] = token;

    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: user.data
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: LOGIN_USER_ERROR,
      payload: error
    });
  }
};

export const loadUser = () => (dispatch, getState) => {
  try {
    dispatch({
      type: LOAD_USER
    });

    if (getState().auth.token) {
      // axios.defaults.headers.common['Authorization'] = getState().auth.token;
      dispatch({
        type: LOAD_USER_SUCCESS
      });
    } else {
      dispatch({
        type: LOAD_USER_ERROR
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const authTokenConfig = getState => {
  const token = getState().auth.token;
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  if (token) {
    // axios.defaults.headers.common['Authorization'] = token;
    config.headers['Authorization'] = 'Bearer ' + token;
  }

  return config;
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER_FETCH:
      return {
        ...state,
        userLoading: true,
        userLoadingError: false
      };
    case LOGIN_USER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.data.user));
      return {
        ...state,
        user: action.payload.data.user,
        userLoading: false,
        isAuthenticated: true,
        token: action.payload.token
      };
    case LOGIN_USER_ERROR:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        userLoadingError: action.payload,
        userLoading: false,
        isAuthenticated: false
      };
    case LOG_OUT_USER:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        userLoading: false,
        isAuthenticated: false,
        token: null,
        user: null,
        userLoadingError: false
      };
    default:
      return state;
  }
};
