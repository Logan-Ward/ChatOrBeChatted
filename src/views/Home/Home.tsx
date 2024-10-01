import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [streamLink, setStreamLink] = useState('');
  const [videoID, setVideoID] = useState('');
  const [streamName, setStreamName] = useState('');
  
  async function init() {
    let tempId = streamLink.split('=')[1].length === 11 ? streamLink.split('=')[1] : streamLink.split('live/')[1].split('?')[0];
    setVideoID(tempId);
    const response = await axios.get(
      `http://localhost:3001/api/stream-name?videoID=${tempId}`
    );
    const { data : { name }} = response;
    setStreamName(name);
  }
  
  return (
    <div className="App">
      <header>
      <h1 className="title">YouTube Chat Games</h1>
      <label className='stream-label'>Stream Link: <input autoComplete="off" className='stream-input' type="text" onChange={(e) => setStreamLink(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') init(); }} /></label>
      <span className='stream-name'>{streamName || 'No Stream Selected'}</span>
      <a className='auth'>Login/Signup</a>
      </header>
    </div>
  );
}

export default Home;
