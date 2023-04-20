import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../page-layout";
import { useState } from "react";
import Modal from "react-modal";

import { PageLoader } from "../page-loader";

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

export default function Keys() {
  const { user, isLoading } = useAuth0();
  const [APIKey, setAPIKey] = useState("");
  const [modalIsOpen, setIsOpen] = React.useState(false);

  Modal.setAppElement("#root");

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  if (isLoading) {
    return <PageLoader />;
  }

  function createKey() {
    fetch(`${process.env.REACT_APP_DEV_PORTAL_API_SERVER}/create-key`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setAPIKey(result.apikey);
        openModal();
      });
  }

  return (
    <PageLayout>
      <>
        <h2 className="white-text">Keys</h2>

        <h4 className="white-text">
          On this page you can create an API key to access the APIs that are
          protected through key-auth.
        </h4>

        <p className="white-text">
          To use the API key, add an <code>apiKey</code> header to your API
          request with your generated key passed as the value
        </p>
        <p className="white-text">
          <strong>
            Note: Make sure to store the key somewhere safe as you will not be
            able to retrieve it once you close the modal
          </strong>
        </p>

        <button className="button__purp" onClick={() => createKey()}>
          Create Key
        </button>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="API Key"
        >
          <h2>Your API key is below!</h2>
          <pre className="black-text">{APIKey}</pre>
          <button className="button__purp" onClick={closeModal}>
            close
          </button>
        </Modal>
      </>
    </PageLayout>
  );
}
