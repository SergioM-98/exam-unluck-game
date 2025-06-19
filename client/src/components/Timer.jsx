import { useEffect, useState } from "react";

function Timer( props ) {
  const [timeLeft, setTimeLeft] = useState(props.seconds);


  useEffect(() => {
    setTimeLeft(props.seconds); 
  }, [props.seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
        props.onTimeout && props.onTimeout();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <div style={{ fontWeight: "bold", fontSize: "2rem", color: "#000" }}>
        Time Left: {timeLeft}s
    </div>
  );
}

export default Timer;