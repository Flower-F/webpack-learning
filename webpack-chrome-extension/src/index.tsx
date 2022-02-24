import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const bulletChat = document.createElement("div");
bulletChat.id = "bullet-chat-everywhere";
document.body.appendChild(bulletChat);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("bullet-chat-everywhere")
);
