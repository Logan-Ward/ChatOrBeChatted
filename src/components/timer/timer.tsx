import React, { useState, useEffect } from 'react';

const timer = ({initialTime, start, setStart}: any) => {
  // Initial time in seconds (1 hour)
  const [timeRemaining, setTimeRemaining] = useState<any>(initialTime);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    
    if (start && !running) {
      setRunning(true);
      const timerInterval = setInterval(() => {
        setTimeRemaining((prevTime: any) => {
          if (prevTime === 0) {
            clearInterval(timerInterval);
            // Perform actions when the timer reaches zero
            console.log('Countdown complete!');
            setRunning(false);
            setStart(false);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
      
      // Cleanup the interval when the component unmounts
      return () => clearInterval(timerInterval);
    }
  }, [start]); // The empty dependency array ensures the effect runs only once on mount

  // Convert seconds to hours, minutes, and seconds
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  return (
    <div>
      <p>Countdown Timer:</p>
      <p>{`${hours}h ${minutes}m ${seconds}s`}</p>
    </div>
  );
};

export default timer;