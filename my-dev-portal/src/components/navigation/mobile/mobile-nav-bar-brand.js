import React from "react";
import { NavLink } from "react-router-dom";

export const MobileNavBarBrand = ({ handleClick }) => {
  return (
    <div onClick={handleClick} className="mobile-nav-bar__brand">
      <NavLink to="/">
        <img
          className="mobile-nav-bar__logo"
          src="https://static.moesif.com/dist/302ffde161af22cc139df50c9845efac.svg"
          alt="Moesif logo"
          width="82"
          height="24"
        />
      </NavLink>
    </div>
  );
};
