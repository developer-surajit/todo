import { combineReducers } from 'redux';
import { authReducer } from './auth';
import { dashboardReducer } from './dashboard.duck';

const rootReducer = combineReducers({
  auth: authReducer,
  stat: dashboardReducer
});

export default rootReducer;
