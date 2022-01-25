import React from "react";
import "./App.css";

function App() {
  const add = (a: number, b: number) => a + b;
  return <h1 className="title">{add(2, 3)}</h1>;
}

export default App;
