import React from "react";
import noPriceIcon from "../../../images/icons/empty-state-price.svg";
import NoticeBox from "../../notice-box";

function NoPriceFound(props) {
  return (
    <NoticeBox
      iconSrc={noPriceIcon}
      title="No plans available"
      description={
        <>
          Open Opportunities API pricing will appear here once active plans are
          available for self-service checkout.
        </>
      }
      actions={
        <>
          <a
            href="https://openopps.com/api/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <button className="button button--outline-secondary">
              Learn more
            </button>
          </a>
        </>
      }
    />
  );
}

export default NoPriceFound;
