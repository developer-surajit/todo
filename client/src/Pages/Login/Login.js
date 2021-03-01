import React from 'react';
import { useDispatch, connect } from 'react-redux';
import { Field, Form, Formik, FormikProps } from 'formik';
import FormField from './../../components/FormField';
import { Link } from 'react-router-dom';
import { login } from '../../ducks/auth';

const Login = props => {
  const dispatch = useDispatch();
  console.log('props in surveynew', props);
  return (
    <div className="container">
      <Formik
        initialValues={{
          email: 'surajitdas94@gmail.com',
          password: 'qwert123'
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
          <form onSubmit={handleSubmit}>
            <Field name="email" placeholder="email" component={FormField} />

            {errors.email && touched.email && errors.email}
            <Field
              name="password"
              placeholder="password"
              component={FormField}
            />

            {errors.password && touched.password && errors.password}

            <button
              className="teal btn-flat right white-text"
              type="submit"
              disabled={isSubmitting}
            >
              Login
              {/* <i className="material-icons right">done</i> */}
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
