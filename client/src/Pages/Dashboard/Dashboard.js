import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Header } from '../../components';
import { getDashboardData } from '../../ducks/dashboard.duck';
import { Chart } from 'react-google-charts';
export const Dashboard = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardData());
  }, []);
  const { dashboardData, dashboardDataLoading, dashboardDataError } = props;
  if (dashboardDataError) {
    return <div>Dashboard error</div>;
  }
  if (dashboardDataLoading) {
    return <div>Loading</div>;
  }
  const { tasksCompleted, totalTasks, latestTasks } = dashboardData || {};
  const hasTask = totalTasks > 0;

  return (
    <div>
      <Header />
      {hasTask ? (
        <>
          <div>
            <div>
              Task completed
              <span>
                {tasksCompleted} / {totalTasks}
              </span>
            </div>
            <div>
              Latest created task
              {latestTasks && latestTasks.length > 0 ? (
                <ul>
                  {latestTasks.map(item => (
                    <li key={item.id}>{item.name}</li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div>
              <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                  ['Task', 'total completion'],
                  ['Total Task', totalTasks],
                  ['Remaining Task', totalTasks - tasksCompleted]
                ]}
                // options={{
                //   title: 'Completed task'
                // }}
                rootProps={{ 'data-testid': '1' }}
              />
            </div>
          </div>
          {/* 2nd row */}
          <div>
            <h3>task</h3>
            <div>
              <input placeholder="search" />
              <button>+ new task</button>
            </div>
          </div>
          {/* 3rd row */}
          <div>
            Latest created task
            {latestTasks && latestTasks.length > 0 ? (
              <ul>
                {latestTasks.map(item => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </>
      ) : (
        <div>add task</div>
      )}
    </div>
  );
};

const mapStateToProps = ({
  stat: { dashboardData, dashboardDataLoading, dashboardDataError }
}) => ({
  dashboardData,
  dashboardDataLoading,
  dashboardDataError
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
