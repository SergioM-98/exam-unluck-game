import { useEffect, useState } from "react";

function Timer({ seconds, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [timeoutCalled, setTimeoutCalled] = useState(false);

  useEffect(() => {
    setTimeLeft(seconds); 
    setTimeoutCalled(false); 
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!timeoutCalled) {
        onTimeout && onTimeout();
        setTimeoutCalled(true);
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onTimeout, timeoutCalled]);

  return (
    <div style={{ fontWeight: "bold", fontSize: "2rem", color: "#000" }}>
        Time Left: {timeLeft}s
    </div>
  );
}

export default Timer;