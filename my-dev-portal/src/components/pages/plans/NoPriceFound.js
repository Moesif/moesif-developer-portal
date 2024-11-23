import React from "react";
import SVG from "react-inlinesvg";
import tagIcon from "../../../images/icons/tag.svg";

function NoPriceFound(props) {
  return (
    <div className="no-plan-box">
      <SVG
        src={tagIcon}
        style={{ width: "100px", height: "100px", fill: "gray" }}
      />
      <h4>No Prices Found</h4>
      <p>
        Plan pricing options will appear here when you create stripe plans using
        the{" "}
        <a
          href="https://www.moesif.com/"
          _target="_blank"
          rel="noreferrer noopener"
        >
          Product Catalogue
        </a>{" "}
        feature in
        <a
          href="https://www.moesif.com"
          _target="_blank"
          rel="noreferrer noopener"
        >
          Moesif
        </a>
        . Sign in to get started.
      </p>

      <button className="button__link">See Docs</button>

      <button className="button__secondary">Go to Moesif</button>
    </div>
  );
}

export default NoPriceFound;
