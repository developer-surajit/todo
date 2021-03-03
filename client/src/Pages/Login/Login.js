import React from 'react';
import { useDispatch, connect } from 'react-redux';
import { Field, Form, Formik, FormikProps } from 'formik';
import { FormField } from './../../components';
import { Link } from 'react-router-dom';
import { login } from '../../ducks/auth';
import './Login.css';

const Login = props => {
  const dispatch = useDispatch();
  console.log('props in surveynew');

  const { userLoading, user, userLoadingError } = props;
  return (
    <div className="container login_container">
      <Formik
        initialValues={{
          email: '',
          password: ''
          // email: 'surajitdas94@gmail.com',
          // password: 'qwert123'
        }}
        validate={values => {
          const errors = {};
          if (!values.email) {
            errors.email = 'Required';
          }
          if (!values.password) {
            errors.password = 'Required';
          }
          //   if (!values.body) {
          //     errors.body = 'Required';
          //   }
          // if (!values.recipients) {
          //   errors.recipients = "Required";
          // }
          // if (values.recipients) {
          //   let invalid = validateEmails(values.recipients);
          //   if (invalid.length) {
          //     errors.recipients = `these are invalid emails ${invalid}`;
          //   }
          // }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log({ values });
          setSubmitting(true);
          dispatch(login(values, props.history));
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
          <form onSubmit={handleSubmit} className={'formContainer'}>
            <div className="heading_main">Login</div>
            <Field name="email" placeholder="email" component={FormField} />
            {errors.email && touched.email && errors.email}
            <Field
              name="password"
              placeholder="password"
              component={FormField}
            />
            {errors.password && touched.password && errors.password}
            <button
              className="teal btn-flat white-text "
              type="submit"
              disabled={userLoading}
            >
              {userLoading ? 'Loading...' : 'Login'}

              {/* <i className="material-icons right">done</i> */}
            </button>
            {userLoadingError && (
              <div style={{ color: 'red' }}>Incorrect username or password</div>
            )}
          </form>
        )}
      </Formik>
    </div>
  );
};

const mapStateToProps = ({
  auth: { userLoading, user, userLoadingError }
}) => ({
  userLoading,
  user,
  userLoadingError
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
