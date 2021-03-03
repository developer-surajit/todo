import React, { useEffect } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Redirect,
  Switch
} from 'react-router-dom';
import { useDispatch, connect } from 'react-redux';

// import { SET_USER_DETAILS, getAuthDetails } from './ducks/auth';
import { LoginPage, DashboardPage } from './Pages';
import { loadUser } from './ducks/auth';

const App = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
    // console.log('token', localStorage.getItem('token'));
  }, []);

  const loggedIn = !!props.user;

  console.log('user', props.user, loggedIn);
  return (
    <div className="App">
      <Router>
        <Switch>
          {/* <Route exact path="/">
            {loggedIn ? <Redirect to="/dashboard" /> : <LoginPage />}
          </Route>
          <Route path="/dashboard" component={DashboardPage} /> */}
          <Route exact path="/">
            {loggedIn ? <DashboardPage /> : <LoginPage />}
          </Route>
          {/* <Route path="/dashboard" component={DashboardPage} /> */}
        </Switch>
      </Router>
    </div>
  );
};

const mapStateToProps = state => {
  console.log('state', state.auth);
  return {
    user: state.auth.user || null
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
