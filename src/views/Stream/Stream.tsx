import React from 'react';
import { useState, useEffect } from 'react';
const streamCss = require('!raw-loader!./Stream.css').default;

function Stream({origin, newWindow}: {origin: string, newWindow: any}) {
  const [trivia, setTrivia] = useState<any>(null);
  const[winners, setWinners] = useState<any[]>([]);
  
  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.origin !== origin) return; // Basic security check
      setTrivia(event.data.trivia || []); // Assuming you have a state variable for this
      setWinners(event.data.winners || []);
    };
    
    const styleElement = newWindow.document.createElement("style");
    styleElement.innerHTML = streamCss; // Insert CSS content as text
    newWindow.document.head.appendChild(styleElement);
    newWindow.document.body.className = 'stream-body';
  
    newWindow.addEventListener("message", handleMessage);
    return () => {
      newWindow.removeEventListener("message", handleMessage);
    }
  }, []);
  
  // TODO: Make the stream window game agnostic
  // TODO: Temporarily add a "game finished" notification and later add the full timer
  // TODO: Fix the styling
  
  return (
    <div className="stream-app">
      <h1 className="stream-title">Trivia Game</h1>
      {/* TODO: Learn why this question mark fixes everything */}
      <div className="stream-question-container"><h2 className="stream-question-title">Question:</h2><span className="stream-question">{trivia?.question}</span></div>
      <h2 className="stream-winners">Winners:</h2>
      <ul className="stream-winners-list">
        {winners.map((winner, i) => (
          <li className="stream-winners-item" key={i}>{winner.authorDetails.displayName}</li>
        ))}
      </ul>
    </div>
  );
}

export default Stream;
