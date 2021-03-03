import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Header } from '../../components';
import { getDashboardData } from '../../ducks/dashboard.duck';
import { Chart } from 'react-google-charts';
import { loadUser } from '../../ducks/auth';
import {
  addTask,
  deleteTask,
  FILTER_TASKS_FETCH,
  getAllTasks,
  toggleChecked
} from '../../ducks/tasks.duck';
import { Field, Form, Formik, FormikProps } from 'formik';
import { FormField } from './../../components';
import './Dashboard.css';
import Modal from 'react-modal';
import M from 'materialize-css/dist/js/materialize.min.js';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 10,
    boxShadow: '0px 4px 8px 0px #00000040'
  }
};
const Item = ({ data }) => {
  const dispatch = useDispatch();
  return (
    <li className="listItem" key={data._id} onClick={() => {}}>
      <label>
        {/* {data.completed ? (
          <input type="checkbox" class="filled-in" checked={'checked'} />
        ) : (
          <input type="checkbox" class="filled-in" />
        )} */}
        <input
          type="checkbox"
          class="filled-in"
          checked={data.completed}
          onClick={() => dispatch(toggleChecked(data._id, data.completed))}
        />
        <span
          style={{ textDecoration: data.completed ? 'line-through' : null }}
        >
          {data.name}
        </span>
      </label>
      <div className="cta_icons">
        <i
          onClick={() => alert('Feature not added yet')}
          class="material-icons prefix"
        >
          mode_edit
        </i>
        <i
          onClick={() => dispatch(deleteTask(data._id))}
          class="material-icons prefix"
        >
          delete
        </i>
      </div>
    </li>
  );
};

export const Dashboard = props => {
  const dispatch = useDispatch();

  const [openModal, setOpenAddTaskModal] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const {
    dashboardData,
    dashboardDataLoading,
    dashboardDataError,
    allTasks,
    allTasksLoading,
    allTasksError,
    filteredTasks
  } = props;

  const { tasksCompleted, totalTasks, latestTasks } = dashboardData || {};
  const hasTask = allTasks && allTasks.length > 0;
  const taskLength = allTasks && allTasks.length > 0 ? allTasks.length : 0;
  const remainingTask = totalTasks - tasksCompleted;
  useEffect(() => {
    dispatch(getDashboardData());
    dispatch(getAllTasks());
  }, [taskLength]);

  useEffect(() => {
    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.sidenav');
      console.log('444', elems);
      M.Sidenav.init(elems, {});
    });
  }, []);

  if (dashboardDataError) {
    return (
      <>
        <Header />
        <div>Dashboard error</div>;
      </>
    );
  }
  if (!dashboardData && dashboardDataLoading) {
    return <div>Loading</div>;
  }

  const setSearch = val => {
    setSearchVal(val);
    dispatch({ type: FILTER_TASKS_FETCH, payload: val });
  };

  return (
    <>
      <Header />
      <div className="container">
        {hasTask ? (
          <>
            <div className="top-row-cards-container">
              <div className="top-row-cards">
                <div className="heading_main">Task completed </div>
                <span>
                  {tasksCompleted} / {totalTasks}
                </span>
              </div>
              <div className="top-row-cards">
                <div className="heading_main">Latest created task</div>
                {latestTasks && latestTasks.length > 0 ? (
                  <ol>
                    {latestTasks.map(item => (
                      <li
                        style={{
                          textDecoration: item.completed ? 'line-through' : null
                        }}
                        key={item.id}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ol>
                ) : null}
              </div>
              <div className="top-row-cards">
                <Chart
                  width={'300px'}
                  height={'100px'}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={[
                    ['Task', 'total completion'],
                    ['Completed Task', tasksCompleted],
                    ['Remaining Task', remainingTask]
                  ]}
                  // data={[
                  //   ['Task', 'total completion'],
                  //   [
                  //     'Total Task',
                  //     totalTasks === remainingTask ? 0 : totalTasks
                  //   ],
                  //   ['Remaining Task', remainingTask]
                  // ]}
                  // options={{
                  //   title: 'Completed task'
                  // }}
                  rootProps={{ 'data-testid': '1' }}
                />
              </div>
            </div>
            {/* 2nd row */}
            <div className="taskSearchRow">
              <div className="heading_main">Task</div>
              <div className="taskSearch">
                <input
                  placeholder="Search by task name"
                  onChange={e => {
                    let val = e.target.value;
                    // dispatch({ type: FILTER_TASKS_FETCH, payload: val });
                    setSearch(val);
                  }}
                  style={{ marginRight: 10 }}
                />
                <button
                  className="btn"
                  onClick={() => setOpenAddTaskModal(true)}
                >
                  + New Task
                </button>
              </div>
            </div>
            {/* 3rd row */}
            <div>
              {searchVal ? (
                filteredTasks && filteredTasks.length ? (
                  <ul>
                    {filteredTasks.map(item => item && <Item data={item} />)}
                  </ul>
                ) : (
                  <div>No results</div>
                )
              ) : allTasks && allTasks.length > 0 ? (
                <ul>{allTasks.map(item => item && <Item data={item} />)}</ul>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <div>
              <div>You have no task</div>
              <button className="btn" onClick={() => setOpenAddTaskModal(true)}>
                + New Task
              </button>
            </div>
          </>
        )}
      </div>
      <Modal
        isOpen={openModal}
        // onAfterOpen={afterOpenModal}
        onRequestClose={() => setOpenAddTaskModal(false)}
        contentLabel="Example Modal"
        style={customStyles}
      >
        <div className="modalStyle">
          {/* <h2 ref={_subtitle => (subtitle = _subtitle)}>Hello</h2> */}
          {/* <button onClick={() => setOpenAddTaskModal(false)}>close</button> */}
          <div>New Task</div>
          <Formik
            initialValues={{
              task: ''
            }}
            validate={values => {
              const errors = {};
              if (!values.task) {
                errors.task = 'Required';
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              console.log({ values });
              setSubmitting(true);
              dispatch(addTask(values));
              setOpenAddTaskModal(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
              isSubmitting
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit} className={'addFormContainer'}>
                <div className="heading_main">+ New task</div>
                <Field
                  name="task"
                  placeholder="Task name"
                  component={FormField}
                />
                {errors.task && touched.task && errors.task}

                <button
                  className="teal btn-flat white-text "
                  type="submit"
                  // disabled={userLoading}
                >
                  {/* {userLoading ? 'Loading...' : 'Login'} */} + New task
                </button>
              </form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
};

const mapStateToProps = ({
  stat: { dashboardData, dashboardDataLoading, dashboardDataError },
  tasks: { allTasks, allTasksLoading, allTasksError, filteredTasks }
}) => ({
  dashboardData,
  dashboardDataLoading,
  dashboardDataError,
  allTasks,
  allTasksLoading,
  allTasksError,
  filteredTasks
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
