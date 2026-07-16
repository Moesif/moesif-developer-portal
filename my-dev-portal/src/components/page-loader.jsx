import React from "react";

export const PageLoader = () => {
  return (
    <div className="page-loader" role="status" aria-label="Loading">
      <span className="page-loader__spinner" aria-hidden="true"></span>
    </div>
  );
};
