import Setting from "./components/Setting";
import React from "react";
import "./App.scss";

function App() {
  const add = (a: number, b: number) => a + b;
  return (
    <h1 className="title">
      <Setting />
    </h1>
  );
}

export default App;
