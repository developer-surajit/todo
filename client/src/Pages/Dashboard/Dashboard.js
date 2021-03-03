import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Header } from '../../components';
import { getDashboardData } from '../../ducks/dashboard.duck';
import { Chart } from 'react-google-charts';
import { loadUser } from '../../ducks/auth';
import { addTask, getAllTasks, toggleChecked } from '../../ducks/tasks.duck';
import { Field, Form, Formik, FormikProps } from 'formik';
import { FormField } from './../../components';
import './Dashboard.css';
import Modal from 'react-modal';

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
        <i onClick={() => {}} class="material-icons prefix">
          mode_edit
        </i>
        <i onClick={() => {}} class="material-icons prefix">
          delete
        </i>
      </div>
    </li>
  );
};

export const Dashboard = props => {
  const dispatch = useDispatch();

  const [openModal, setOpenAddTaskModal] = useState(false);

  const {
    dashboardData,
    dashboardDataLoading,
    dashboardDataError,
    allTasks,
    allTasksLoading,
    allTasksError
  } = props;

  const { tasksCompleted, totalTasks, latestTasks } = dashboardData || {};
  const hasTask = allTasks && allTasks.length > 0;
  const taskLength = allTasks && allTasks.length > 0 ? allTasks.length : 0;
  const remainingTask = totalTasks - tasksCompleted;
  useEffect(() => {
    dispatch(getDashboardData());
    dispatch(getAllTasks());
  }, [taskLength]);

  if (dashboardDataError) {
    return (
      <>
        <Header />
        <div>Dashboard error</div>;
      </>
    );
  }
  if (dashboardDataLoading) {
    return <div>Loading</div>;
  }
  return (
    <>
      <Header />
      <div className="container">
        {hasTask ? (
          <>
            <div className="top-row-cards-container">
              <div className="top-row-cards">
                Task completed{' '}
                <span>
                  {tasksCompleted} / {totalTasks}
                </span>
              </div>
              <div className="top-row-cards">
                Latest created task
                {latestTasks && latestTasks.length > 0 ? (
                  <ul>
                    {latestTasks.map(item => (
                      <li key={item.id}>{item.name}</li>
                    ))}
                  </ul>
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
                    [
                      'Total Task',
                      totalTasks === remainingTask ? 0 : totalTasks
                    ],
                    ['Remaining Task', remainingTask]
                  ]}
                  // options={{
                  //   title: 'Completed task'
                  // }}
                  rootProps={{ 'data-testid': '1' }}
                />
              </div>
            </div>
            {/* 2nd row */}
            <div className="taskSearchRow">
              <h3>task</h3>
              <div className="taskSearch">
                <input placeholder="search" />
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
              {allTasks && allTasks.length > 0 ? (
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
        style={{}}
        contentLabel="Example Modal"
      >
        {/* <h2 ref={_subtitle => (subtitle = _subtitle)}>Hello</h2> */}
        <button onClick={() => setOpenAddTaskModal(false)}>close</button>
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
              <div className="heading_main">Add task</div>
              <Field name="task" placeholder="Add task" component={FormField} />
              {errors.task && touched.task && errors.task}

              <button
                className="teal btn-flat white-text "
                type="submit"
                // disabled={userLoading}
              >
                {/* {userLoading ? 'Loading...' : 'Login'} */} Add task
              </button>
            </form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

const mapStateToProps = ({
  stat: { dashboardData, dashboardDataLoading, dashboardDataError },
  tasks: { allTasks, allTasksLoading, allTasksError }
}) => ({
  dashboardData,
  dashboardDataLoading,
  dashboardDataError,
  allTasks,
  allTasksLoading,
  allTasksError
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
