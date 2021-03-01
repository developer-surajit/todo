import React from 'react';

export default ({ field, form, ...props }) => {
  // console.log({ props });
  //   const { errors, name, touched } = props;
  return (
    <div className="input-field col s6">
      <input {...field} {...props} />
    </div>
  );
};
