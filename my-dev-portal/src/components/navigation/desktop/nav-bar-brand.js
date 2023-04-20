import React from "react";
import { NavLink } from "react-router-dom";

export const NavBarBrand = () => {
  return (
    <div className="nav-bar__brand">
      <NavLink to="/">
        <img
          className="nav-bar__logo"
          src="https://static.moesif.com/dist/302ffde161af22cc139df50c9845efac.svg"
          alt="Moesif Logo"
          width="122"
          height="36"
        />
      </NavLink>
    </div>
  );
};
