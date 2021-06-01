import React from 'react';

const Error = ({ err }) => {
  return (
    <div className='error_page'>
      <h1>404</h1>
      <h1>{err} </h1>
    </div>
  );
};

export default Error;
