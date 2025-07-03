import React, { useState, useEffect } from 'react';

const WelcomePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1><strong>Welcome to CHARUSAT!!!!</strong></h1>

      <h2>
        <strong>It is {currentTime.toLocaleDateString()}</strong>
      </h2>

      <h2>
        <strong>It is {currentTime.toLocaleTimeString()}</strong>
      </h2>
    </div>
  );
};

export default WelcomePage;
