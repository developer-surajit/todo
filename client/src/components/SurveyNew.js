import React from "react";
import { useDispatch } from "react-redux";
import { Field, Form, Formik, FormikProps } from "formik";
import FormField from "./FormField";
import { Link } from "react-router-dom";
import validateEmails from "./utils/validateEmails";
import { sendEmails } from "../ducks/auth";

export default function SurveyNew(props) {
  const dispatch = useDispatch();
  console.log("props in surveynew", props);
  return (
    <div className="container">
      <Formik
        initialValues={{
          title: "",
          subject: "",
          body: "",
          recipients: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.title) {
            errors.title = "Required";
          }
          if (!values.subject) {
            errors.subject = "Required";
          }
          if (!values.body) {
            errors.body = "Required";
          }
          if (!values.recipients) {
            errors.recipients = "Required";
          }
          if (values.recipients) {
            let invalid = validateEmails(values.recipients);
            if (invalid.length) {
              errors.recipients = `these are invalid emails ${invalid}`;
            }
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log({ values });
          setSubmitting(true);
          dispatch(sendEmails(values, props.history));
        }}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <Field name="title" placeholder="Title" component={FormField} />

            {errors.title && touched.title && errors.title}
            <Field name="subject" placeholder="Subject" component={FormField} />

            {errors.subject && touched.subject && errors.subject}
            <Field name="body" placeholder="Email body" component={FormField} />

            {errors.body && touched.body && errors.body}
            <Field
              name="recipients"
              placeholder="recipients emails list sperated by space"
              component={FormField}
            />

            {errors.recipients && touched.recipients && errors.recipients}

            <button
              className="teal btn-flat right white-text"
              type="submit"
              disabled={isSubmitting}
            >
              Next
              <i className="material-icons right">done</i>
            </button>
          </form>
        )}
      </Formik>
      <Link to="/surveys" className="red btn-flat white-text left">
        Cancel
      </Link>
    </div>
  );
}
