import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Modal from "react-modal";
//@ts-ignore
// import { registerSW } from "virtual:pwa-register";

Modal.setAppElement("#root");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
