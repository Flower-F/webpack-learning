import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [title, setTitle] = useState("Update!!!!");

  return <h1 className="title">{title}</h1>;
};

export default App;
