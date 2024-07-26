import React from "react";
import { NavLink } from "react-router-dom";

export const NavBarBrand = () => {
  return (
    <div className="nav-bar__brand">
      <NavLink to="/">
        <img
          className="nav-bar__logo"
          src="https://www.moesif.com/logo.png"
          alt="Moesif Logo"
          height="36"
        />
      </NavLink>
    </div>
  );
};
