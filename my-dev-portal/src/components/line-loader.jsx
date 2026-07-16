import React from "react";

export function LineLoader() {
  return (
    <div
      className="page-loader page-loader--inline"
      role="status"
      aria-label="Loading"
    >
      <span className="page-loader__spinner" aria-hidden="true"></span>
    </div>
  );
}
