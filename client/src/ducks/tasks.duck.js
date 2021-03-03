import axios from 'axios';
import { authTokenConfig } from './auth';
import { getDashboardData } from './dashboard.duck';
// import { useHistory } from "react-router-dom";
// Action types

export const TASKS_FETCH = 'tasks/TASKS_FETCH';
export const TASKS_SUCCESS = 'tasks/TASKS_SUCCESS';
export const TASKS_ERROR = 'tasks/TASKS_ERROR';

export const ADD_TASKS_FETCH = 'tasks/ADD_TASKS_FETCH';
export const ADD_TASKS_SUCCESS = 'tasks/ADD_TASKS_SUCCESS';
export const ADD_TASKS_ERROR = 'tasks/ADD_TASKS_ERROR';

export const DELETE_TASKS_FETCH = 'tasks/DELETE_TASKS_FETCH';
export const DELETE_TASKS_SUCCESS = 'tasks/DELETE_TASKS_SUCCESS';
export const DELETE_TASKS_ERROR = 'tasks/DELETE_TASKS_ERROR';

export const TOGGLE_TASKS_FETCH = 'tasks/TOGGLE_TASKS_FETCH';
export const TOGGLE_TASKS_SUCCESS = 'tasks/TOGGLE_TASKS_SUCCESS';
export const TOGGLE_TASKS_ERROR = 'tasks/TOGGLE_TASKS_ERROR';

export const FILTER_TASKS_FETCH = 'tasks/FILTER_TASKS_FETCH';

// Actions

export const getAllTasks = () => async (dispatch, getState) => {
  try {
    dispatch({ type: TASKS_FETCH });

    const tasks = await axios.get('/api/v1/tasks', authTokenConfig(getState));
    console.log({ tasks });
    dispatch({
      type: TASKS_SUCCESS,
      payload: tasks.data.data.tasks
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: TASKS_ERROR, payload: error });
  }
};
export const toggleChecked = (id, val) => async (dispatch, getState) => {
  try {
    dispatch({ type: TOGGLE_TASKS_FETCH, payload: id });

    const editTasks = await axios.put(
      `/api/v1/tasks/${id}`,
      {
        completed: !val
      },
      authTokenConfig(getState)
    );
    console.log({ editTasks });

    dispatch({
      type: TOGGLE_TASKS_SUCCESS,
      payload: editTasks.data.data.tasks
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: TOGGLE_TASKS_ERROR, payload: error });
  }
};

export const addTask = values => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_TASKS_FETCH });

    const addtasks = await axios.post(
      '/api/v1/tasks',
      {
        name: values.task,
        completed: false
      },
      authTokenConfig(getState)
    );
    console.log({ addtasks });
    dispatch({
      type: ADD_TASKS_SUCCESS,
      payload: addtasks.data.data.task
    });
    if (!getState().stat.dashboardData) {
      dispatch(getDashboardData());
    }
  } catch (error) {
    console.log(error);
    dispatch({ type: ADD_TASKS_ERROR, payload: error });
  }
};
export const deleteTask = id => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_TASKS_FETCH, payload: id });

    const deleteTask = await axios.delete(
      `/api/v1/tasks/${id}`,
      authTokenConfig(getState)
    );
    console.log({ deleteTask });

    dispatch({
      type: DELETE_TASKS_SUCCESS
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: DELETE_TASKS_ERROR, payload: error });
  }
};

// Reducer
const initialValues = {
  allTasks: [],
  allTasksLoading: false,
  allTasksError: false,

  toggleTasksLoading: false,
  toggleTasksError: false,

  latestTask: null,
  addTasksLoading: false,
  addTasksError: false,

  deleteTasksLoading: false,

  filteredTasks: []
};

export const tasksReducer = (state = initialValues, action) => {
  switch (action.type) {
    case TASKS_FETCH:
      return {
        ...state,
        allTasksLoading: true
      };
    case TASKS_SUCCESS:
      return {
        ...state,
        allTasks: action.payload,
        allTasksLoading: false
      };
    case TASKS_ERROR:
      return {
        ...state,
        allTasksError: action.payload,
        allTasksLoading: false
      };

    case ADD_TASKS_FETCH:
      return {
        ...state,
        addTasksLoading: true
      };
    case ADD_TASKS_SUCCESS:
      return {
        ...state,
        latestTask: action.payload,
        addTasksLoading: false,
        allTasks:
          state.allTasks && state.allTasks.length
            ? [action.payload, ...state.allTasks]
            : [...action.payload]
      };
    case ADD_TASKS_ERROR:
      return {
        ...state,
        addTasksError: action.payload,
        addTasksLoading: false
      };

    case TOGGLE_TASKS_FETCH:
      return {
        ...state,
        toggleTasksLoading: true,
        allTasks: state.allTasks.map(item =>
          item && item._id === action.payload
            ? { ...item, completed: !item.completed }
            : item
        )
      };
    case TOGGLE_TASKS_SUCCESS:
      return {
        ...state,
        toggleTasksLoading: false,
        allTasks: [...state.allTasks, action.payload]
      };
    case TOGGLE_TASKS_ERROR:
      return {
        ...state,
        toggleTasksLoading: false,
        addTasksError: action.payload
      };

    case DELETE_TASKS_FETCH:
      return {
        ...state,
        deleteTasksLoading: true,
        allTasks: state.allTasks.filter(
          item => item && item._id !== action.payload
        )
      };
    case DELETE_TASKS_SUCCESS:
      return {
        ...state,
        deleteTasksLoading: false
        // deleteTasksSuccess: true
        // allTasks: [...state.allTasks, action.payload]
      };
    case DELETE_TASKS_ERROR:
      return {
        ...state,
        deleteTasksLoading: false,
        addTasksError: action.payload
      };

    case FILTER_TASKS_FETCH:
      let txtValue = action.payload;

      return {
        ...state,
        filteredTasks: state.allTasks.filter(item => {
          if (
            item &&
            item.name.toUpperCase().indexOf(txtValue.toUpperCase()) > -1
          ) {
            return true;
          }
          return false;
        })
      };
    default:
      return state;
  }
};
