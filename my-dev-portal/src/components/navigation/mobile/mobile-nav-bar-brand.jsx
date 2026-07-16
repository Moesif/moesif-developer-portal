import React from "react";
import { NavLink } from "react-router-dom";
import openOpportunitiesLogo from "../../../images/assets/open-opportunities-logo.png";

export const MobileNavBarBrand = ({ handleClick }) => {
  return (
    <div onClick={handleClick} className="mobile-nav-bar__brand">
      <NavLink className="mobile-nav-bar__brand-link" to="/">
        <img
          className="mobile-nav-bar__logo-full"
          src={openOpportunitiesLogo}
          alt="Open Opportunities"
        />
        <span className="mobile-nav-bar__brand-text">Developer Portal</span>
      </NavLink>
    </div>
  );
};
