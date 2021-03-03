import { combineReducers } from 'redux';
import { authReducer } from './auth';
import { dashboardReducer } from './dashboard.duck';
import { tasksReducer } from './tasks.duck';

const rootReducer = combineReducers({
  auth: authReducer,
  stat: dashboardReducer,
  tasks: tasksReducer
});

export default rootReducer;
