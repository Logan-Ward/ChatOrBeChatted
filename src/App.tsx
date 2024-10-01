import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Trivia from './views/Trivia/Trivia';
import Stream from './views/Stream/Stream';
import './App.css';

function App() {
  const [streamLink, setStreamLink] = useState('');
  const [videoID, setVideoID] = useState('');
  const [streamName, setStreamName] = useState('');
  const [streamWindow, setStreamWindow] = useState<any>(null);

  async function init() {
    // TODO: Account for other link formats such as links from playlists
    let tempId =
      streamLink.split('=')[1].length === 11
        ? streamLink.split('=')[1]
        : streamLink.split('live/')[1].split('?')[0];
    setVideoID(tempId);
    const response = await axios.get(
      `http://localhost:3001/api/stream-name?videoID=${tempId}`
    );
    const {
      data: { name },
    } = response;
    setStreamName(name);
  }

  function openStreamWindow() {
    const streamView: any = window.open(
      '',
      'Stream View',
      'width=1200,height=800'
    );
    setStreamWindow(streamView);
    streamView.document.body.innerHTML = '';
    const root = streamView.document.createElement('div');
    streamView.document.body.appendChild(root);
    const reactRoot = ReactDOM.createRoot(root);
    reactRoot.render(<Stream origin={window.location.origin} newWindow={streamView}/>);
  }

  function handleStreamViewClick() {
    if (!streamWindow || streamWindow.closed) {
      openStreamWindow();
    } else {
      streamWindow.focus();
    }
  }
  
  // TODO: Full version will need routes and potentially redux
  // TODO: Full version will need authentication
  // TODO: Add a search button as an alternative to pressing 'enter'

  return (
    <div className='App'>
      <header>
        <h1 className='title'>YouTube Chat Games</h1>
        <label className='stream-label'>
          Stream Link:{' '}
          <input
            autoComplete='off'
            className='stream-input'
            type='text'
            onChange={(e) => setStreamLink(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') init();
            }}
          />
        </label>
        <span className='stream-name'>
          {streamName || 'No Stream Selected'}
        </span>
        <button className='stream-view' onClick={handleStreamViewClick}>
          Stream View
        </button>
        {/* <a className='auth'>Login/Signup</a> */}
      </header>
      <Trivia videoID={videoID} streamWindow={streamWindow} gameStart={handleStreamViewClick}/>
    </div>
  );
}

export default App;
