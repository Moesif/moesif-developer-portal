import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import moesifBrowser from "moesif-browser-js";
import reportWebVitals from "./reportWebVitals";
import "https://js.stripe.com/v3/pricing-table.js";
import "./styles/styles.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

if (process.env.REACT_APP_MOESIF_PUBLISHABLE_APPLICATION_ID) {
  moesifBrowser.init({
    applicationId: process.env.REACT_APP_MOESIF_PUBLISHABLE_APPLICATION_ID,
    // add other option here
  });
  if (window) {
    window.moesif = moesifBrowser;
  }
} else {
  console.log(
    "Please add using REACT_APP_MOESIF_PUBLISHABLE_APPLICATION_ID to .env to enable Moesif Browser JS to track actions such as sign up"
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
