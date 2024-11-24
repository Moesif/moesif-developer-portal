import React from "react";
import SVG from "react-inlinesvg";
import tagIcon from "../../../images/icons/tag.svg";
import { iconFillColor } from '../../../common/constants';

function NoPriceFound(props) {
  return (
    <div className="no-plan-box">
      <SVG
        src={tagIcon}
        style={{ width: "100px", height: "100px", fill: iconFillColor }}
      />
      <h4 className="box-title">No Prices Found</h4>
      <p className="box-description">
        Plan pricing options will appear here when you create stripe plans using
        the{" "}
        <a
          href="https://www.moesif.com/docs/product-catalog/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Product Catalogue
        </a>{" "}
        feature in{" "}
        <a
          href="https://www.moesif.com"
          target="_blank"
          rel="noreferrer noopener"
        >
          Moesif
        </a>
        . Sign in to get started.
      </p>

      <div className="box-actions">
        <a
          href="https://www.moesif.com/docs/product-catalog/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <button className="button button__link">See Docs</button>
        </a>
        <a
          href="https://www.moesif.com"
          target="_blank"
          rel="noreferrer noopener"
        >
          <button className="button button--outline-secondary">
            Go to Moesif
          </button>
        </a>
      </div>
    </div>
  );
}

export default NoPriceFound;
