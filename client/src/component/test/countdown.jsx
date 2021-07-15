import React, { useState, useEffect } from "react";

function secondsToTime(seconds) {
  const format = (val) => `0${Math.floor(val)}`.slice(-2);
  const hours = seconds / 3600;
  const minutes = (seconds % 3600) / 60;

  return [hours, minutes, seconds % 60].map(format).join(":");
}

function Countdown() {
  /* `counter` is number of seconds the test will go */
  const [counter, setCounter] = useState(3600);
  useEffect(() => {
    const timer = setInterval(() => setCounter((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="App">
      <div className="answerBtn">
        Countdown:
        <div>{secondsToTime(counter)}</div>
      </div>
    </div>
  );
}

export default Countdown;
