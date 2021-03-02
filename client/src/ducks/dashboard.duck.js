import axios from 'axios';
// import { useHistory } from "react-router-dom";
// Action types

export const DASHBOARD_DETAILS_FETCH = 'dashboard/DASHBOARD_DETAILS_FETCH';
export const DASHBOARD_DETAILS_SUCCESS = 'dashboard/DASHBOARD_DETAILS_SUCCESS';
export const DASHBOARD_DETAILS_ERROR = 'dashboard/DASHBOARD_DETAILS_ERROR';

// Actions

export const getDashboardData = history => async dispatch => {
  try {
    dispatch({ type: DASHBOARD_DETAILS_FETCH });
    const dashboard = await axios.get('/api/v1/tasks/dashboard');
    console.log('called 3', dashboard);
    dispatch({
      type: DASHBOARD_DETAILS_SUCCESS,
      payload: dashboard.data.data
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: DASHBOARD_DETAILS_ERROR, payload: error });
  }
};

// Reducer
const initialValues = {
  dashboardData: null,
  dashboardDataLoading: false,
  dashboardDataError: false
};

export const dashboardReducer = (state = initialValues, action) => {
  switch (action.type) {
    case DASHBOARD_DETAILS_FETCH:
      return {
        ...state,
        dashboardDataLoading: true
      };
    case DASHBOARD_DETAILS_SUCCESS:
      return {
        ...state,
        dashboardData: action.payload,
        dashboardDataLoading: false
      };
    case DASHBOARD_DETAILS_ERROR:
      return {
        ...state,
        dashboardDataError: action.payload,
        dashboardDataLoading: false
      };
    default:
      return state;
  }
};
