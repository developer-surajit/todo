import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LOG_OUT_USER } from '../ducks/auth';

// const onToken = (token) => {
//   console.log({ token });
//   BuyCredit(token);
// };

const Header = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => {
    console.log('redux state', state);
    return state.auth;
  });
  console.log('key', process.env.REACT_APP_STRIPE_PUB_KEY);
  console.log({ auth });

  const isLoggedIn = auth.user && auth.user._id;
  const name = isLoggedIn ? auth.user.name : '';
  return (
    <nav>
      <div className="nav-wrapper container">
        <Link to={'/'} className="brand-logo">
          {name}
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <button
              className="btn"
              onClick={() => dispatch({ type: LOG_OUT_USER })}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
