import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);
  const incrementFive = () => setCount(count + 5);

  return (
    <div className="main-container">
      <div className="card">
        <h2 className="count">🔢 Count: <span>{count}</span></h2>

        <div className="button-group">
          <button onClick={reset}>Reset</button>
          <button onClick={increment}>+1</button>
          <button onClick={decrement}>-1</button>
          <button onClick={incrementFive}>+5</button>
        </div>

        <h1 className="welcome">🎓 Welcome to <span>CHARUSAT!!!</span></h1>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="name-display">
          <p><strong>First Name:</strong> {firstName}</p>
          <p><strong>Last Name:</strong> {lastName}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
