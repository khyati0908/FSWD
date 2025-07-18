import React, { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleEvaluate = () => {
    try {
      // eslint-disable-next-line no-eval
      const evalResult = eval(input);
      setResult(evalResult);
    } catch {
      setResult("Error");
    }
  };

  return (
    <div className="calculator">
      <div className="display">
        {result !== "" && <span>({result})</span>}
        {input || "0"}
      </div>
      <div className="operators">
        <button onClick={() => handleClick("/")}>/</button>
        <button onClick={() => handleClick("*")}>*</button>
        <button onClick={() => handleClick("+")}>+</button>
        <button onClick={() => handleClick("-")}>-</button>
        <button className="del" onClick={handleDelete}>DEL</button>
      </div>
      <div className="digits">
        {[1,2,3,4,5,6,7,8,9,0].map((n) => (
          <button key={n} onClick={() => handleClick(n.toString())}>{n}</button>
        ))}
        <button onClick={() => handleClick(".")}>.</button>
        <button onClick={handleEvaluate}>=</button>
      </div>
    </div>
  );
}

export default App;
