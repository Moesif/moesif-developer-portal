import React from "react";
import { NavLink } from "react-router-dom";
import openOpportunitiesLogo from "../../../images/assets/open-opportunities-logo.png";

export const NavBarBrand = () => {
  return (
    <div className="nav-bar__brand">
      <NavLink className="nav-bar__brand-link" to="/">
        <img
          className="nav-bar__logo-full"
          src={openOpportunitiesLogo}
          alt="Open Opportunities"
        />
        <span className="nav-bar__portal-label">Developer Portal</span>
      </NavLink>
    </div>
  );
};
