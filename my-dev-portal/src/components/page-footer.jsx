import React from "react";

export const PageFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="page-footer">
      <div className="page-footer__inner">
        <span className="page-footer__brand">Open Opportunities</span>
        <span className="page-footer__copy">
          &copy; {year} Spend Network. All rights reserved.
        </span>
      </div>
    </footer>
  );
};
