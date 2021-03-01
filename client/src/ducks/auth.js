import axios from 'axios';
// import { useHistory } from "react-router-dom";
// Action types

export const SET_USER_DETAILS = 'auth/SET_USER_DETAILS';

// Actions
export const login = (val, history) => async dispatch => {
  try {
    const user = await axios.post('/api/v1/users/login', {
      email: val.email,
      password: val.password
    });
    console.log({ user });
    // axios.defaults.headers.common['Authorization'] =
    //   'Bearer ' + user.data.data.user.token;
    dispatch({
      type: SET_USER_DETAILS,
      payload: user.data.data.user
    });
  } catch (error) {
    console.log(error);
  }
};
export const getAuthDetails = (val, history) => async dispatch => {
  try {
    const user = await axios.get('/api/v1/users', {
      email: val.email,
      password: val.password
    });
    console.log({ user });
    // dispatch({
    //   type: SET_USER_DETAILS,
    //   payload: user.data.data,
    // });
  } catch (error) {
    console.log(error);
  }
};

export const buyCredit = token => async dispatch => {
  try {
    console.log('token in buy credit', token);
    const user = await axios.post('/api/save-stripe-token', token);
    console.log('user data', user);
    dispatch({
      type: SET_USER_DETAILS,
      payload: user.data.data
    });
  } catch (error) {
    console.log(error);
  }
};
export const sendEmails = (values, history) => async dispatch => {
  try {
    // let history = useHistory();
    console.log('values in send mail', values);
    const user = await axios.post('/api/surveys', values);
    console.log('user data', user);
    dispatch({
      type: SET_USER_DETAILS,
      payload: user.data.data
    });
    history.push('/surveys');
  } catch (error) {
    console.log(error);
  }
};

// Reducer

export const authReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_USER_DETAILS:
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};
