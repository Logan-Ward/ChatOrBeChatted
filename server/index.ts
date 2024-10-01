import { config } from 'dotenv';
config();

import express from 'express';
import axios from 'axios';
import path from 'path';


const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static(path.resolve('build')));

const API_KEY = process.env.API_KEY;
const YT_API_KEY = process.env.YT_API_KEY;

// API endpoint to signup
app.post('/api/signup', async (req: any, res: any) => {
  const { email, password } = req.body;
  const response = await axios.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${API_KEY}`, {
    email,
    password,
    returnSecureToken: true
  });
  res.json(response.data);
});

// API endpoint to login
app.post('/api/login', async (req: any, res: any) => {
  const { email, password } = req.body;
  const response = await axios.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${API_KEY}`, {
    email,
    password,
    returnSecureToken: true
  });
  res.json(response.data);
});

// API endpoint to get stream name
app.get('/api/stream-name', async (req: any, res: any) => {
  const videoID = req.query.videoID;
  
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=${YT_API_KEY}`);
    const data = response.data;
    const name = data.items[0].snippet.title;
    res.json({ name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stream name' });
  }
});

// API endpoint to get live chat ID
app.get('/api/live-chat-id', async (req: any, res: any) => {
  const videoID = req.query.videoID;
  const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoID}&key=${YT_API_KEY}`);
  const data = response.data;
  const liveChatId = data.items[0].liveStreamingDetails.activeLiveChatId;
  console.log(data.items[0].liveStreamingDetails.concurrentViewers);
  res.json({ liveChatId });
});

// API endpoint to fetch chat messages
app.get('/api/chat-messages', async (req: any, res: any) => {
  const liveChatId = req.query.liveChatId;
  const startTime = req.query.startTime;
  try {
    console.log(startTime);
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${YT_API_KEY}`);
    const data = response.data;
    console.log(data.items[0]);
    const messages = data.items//.filter((item: any) => item.snippet.publishedAt >= startTime);
    res.json({ messages });
  } catch (error) {
    console.error('error:', error);
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
});

// Catch-all route to serve the React app
app.get('*', (req: any, res: any) => {
  res.sendFile(path.join(path.resolve('build'), '../build/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});