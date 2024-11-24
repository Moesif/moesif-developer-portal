import React from "react";
import { NavLink } from "react-router-dom";

export const MobileNavBarBrand = ({ handleClick }) => {
  return (
    <div onClick={handleClick} className="mobile-nav-bar__brand">
      <NavLink to="/">
        <img
          className="mobile-nav-bar__logo"
          src="https://www.moesif.com/logo.png"
          alt="Moesif logo"
          height="24"
        />
      </NavLink>
    </div>
  );
};
