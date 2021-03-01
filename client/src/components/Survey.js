import React, { Component } from "react";
import { Link } from "react-router-dom";

const Survey = () => {
  return (
    <div className="container">
      Dashboard
      <div className="fixed-action-btn">
        <Link to="/surveys/new" className="btn-floating btn-large red">
          <i className="large material-icons">add</i>
        </Link>
      </div>
    </div>
  );
};

export default Survey;
