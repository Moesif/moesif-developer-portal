import React from 'react';

const AsgardeoError = ({ error }) => (
  <div>
    <h1>Error</h1>
    <p>An error occurred: {error.message}</p>
  </div>
);

export default AsgardeoError;
