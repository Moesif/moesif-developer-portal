import React from "react";
import SVG from "react-inlinesvg";
import { Link } from "react-router-dom";
import noPriceIcon from "../../../images/icons/empty-state-price.svg";
import { iconFillColor } from "../../../common/constants";

function SuccessNotice(props) {
  return (
    <div className="no-plan-box">
      <SVG
        src={noPriceIcon}
        style={{ width: "100px", height: "100px", fill: iconFillColor }}
      />
      <h4 className="box-title">Success</h4>
      <p className="box-description">
        You are now subscription to the plan and price.
      </p>
      <div className="box-actions">
        <a
          href="https://www.moesif.com/docs/product-catalog/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <button className="button button__link">See Docs</button>
        </a>
        <Link
          to="/keys"
          rel="noreferrer noopener"
        >
          <button className="button button--outline-secondary">
            Get API Key
          </button>
        </Link>
      </div>
    </div>
  );
}

export default SuccessNotice;
