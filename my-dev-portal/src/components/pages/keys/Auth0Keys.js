import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Modal from "react-modal";
import SVG from "react-inlinesvg";
import copy from "copy-to-clipboard";

import { PageLayout } from "../../page-layout";
import { PageLoader } from "../../page-loader";
import copyIcon from "../../../images/icons/copy.svg";
import successIcon from "../../../images/icons/success.svg";
import apiKeyIcon from "../../../images/icons/api-key.svg";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Auth0Keys = () => {
  const { user: auth0User, isLoading: auth0IsLoading } = useAuth0();
  const [APIKey, setAPIKey] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  let isLoading = auth0IsLoading;
  let userEmail = auth0User?.email;

  Modal.setAppElement("#root");

  function createKey() {
    fetch(`${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/create-key`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create key");
        }
        return res.json();
      })
      .then((result) => {
        console.log(result);
        setAPIKey(result.apikey);
        openModal(setIsOpen);
      })
      .catch((error) => {
        setAPIKey("Error creating key:", error);
        openModal(setIsOpen);
      });
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <PageLayout>
      <>
        <h2 className="white-text">Keys</h2>
        <h4 className="white-text">
          On this page, you can create an API key to access the APIs that are
          protected through key-auth.
        </h4>
        <p className="white-text">
          To use the API key, add an <code>apiKey</code> header to your API
          request with the generated key as the value.
        </p>
        <p className="white-text">
          <strong>
            Note: Make sure to store the key somewhere safe as you will not be
            able to retrieve it once you close the modal.
          </strong>
        </p>
        <button className="button__purp" onClick={createKey}>
          Create Key
        </button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="API Key"
        >
          <h3 className="modal-title">Copy API Key</h3>
          <div className="modal-body">
            <label>Your API Key</label>
            <div className="api-key-container">
              <span className="api-key-presentation">
                <SVG src={apiKeyIcon} />
                <pre className="api-key">{APIKey}</pre>
              </span>
              <button
                className="copy-button"
                onClick={() => {
                  const successfulCopy = copy(APIKey);
                  if (successfulCopy) {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 3000);
                  }
                }}
              >
                <SVG
                  className="icon"
                  style={{ width: "15px", height: "13.5px" }}
                  fill="currentcolor"
                  src={isCopied ? successIcon : copyIcon}
                />
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="button button--outline-secondary"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </Modal>
      </>
    </PageLayout>
  );
};

export default Auth0Keys;
