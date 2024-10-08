import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from '../../components/timer/timer';
import './Trivia.css';

interface ChatMessage {
  authorDetails: {
    displayName: string;
    isChatSponsor: boolean;
  };
  snippet: {
    displayMessage: string;
  };
  id: string;
}

interface Trivia {
  question: string;
  answer: string;
}

const dummyMessages: ChatMessage[] = [
  {
    authorDetails: {
      displayName: 'User1',
      isChatSponsor: false,
    },
    snippet: {
      displayMessage: 'My name is Joe',
    },
    id: '1',
  },
  {
    authorDetails: {
      displayName: 'User2',
      isChatSponsor: false,
    },
    snippet: {
      displayMessage: 'My name is Bob',
    },
    id: '2',
  },
  {
    authorDetails: {
      displayName: 'User3',
      isChatSponsor: false,
    },
    snippet: {
      displayMessage: 'My name is Steve',
    },
    id: '3',
  },
  {
    authorDetails: {
      displayName: 'User4',
      isChatSponsor: false,
    },
    snippet: {
      displayMessage: 'My name is Bob',
    },
    id: '4',
  },
  {
    authorDetails: {
      displayName: 'User5',
      isChatSponsor: false,
    },
    snippet: {
      displayMessage: 'My name is Bob',
    },
    id: '5',
  },
  {
    authorDetails: {
      displayName: 'User5',
      isChatSponsor: false,
    },
    snippet: {
      displayMessage: 'My name is Bob',
    },
    id: '5',
  },
  {
    authorDetails: {
      displayName: 'User5',
      isChatSponsor: false,
    },
    snippet: {
      displayMessage: 'My name is Bob',
    },
    id: '5',
  },
  {
    authorDetails: {
      displayName: 'User5',
      isChatSponsor: false,
    },
    snippet: {
      displayMessage: 'My name is Bob',
    },
    id: '5',
  },
  {
    authorDetails: {
      displayName: 'User5',
      isChatSponsor: false,
    },
    snippet: {
      displayMessage: 'My name is Bob',
    },
    id: '5',
  },
  {
    authorDetails: {
      displayName: 'Uselkjfbvlaijfbvlkjbnflkijbasvfdlkjibasfvlkjbasvfdlkjbvafsdlkjbasfvlkjbasvflkjbasfvlkjbsafvdlkjbsfvlkjbsvflkjibsvflikjbsavflkjibasvflkijbsvlkijblkjihbasvfdlkjibasvfdlkjhbasvflkjibasdvflkjbasvflkjbasvfdlkjbsafvlkjbiwsvrlkjibvfslbjkisvflkjbsavflkjbasvflkjbavsflkjibavsfjbdvfalkjbasvfdlikjbr5',
      isChatSponsor: false,
    },
    snippet: {
      displayMessage: 'My name is Bobskjdfgbvksjvnbkvjskvjnskj ksjnndf kbskdfbn ksjdnb kjsbdf kjsbfdk jbnskdfj bskjdfb ksjdvfb ksjdfb kswjdbv ksjbv ksjdbv ksjdbv ksjbdv ksjbv ksjdbv kwsjbf wkjbdvkcjbsbvdkbsvksjbvksjvbskbvjskjbdv',
    },
    id: '5',
  },
  {
    authorDetails: {
      displayName: 'User5',
      isChatSponsor: false,
    },
    snippet: {
      displayMessage: 'My name is Bob',
    },
    id: '5',
  },
  {
    authorDetails: {
      displayName: 'User5',
      isChatSponsor: false,
    },
    snippet: {
      displayMessage: 'My name is Bob',
    },
    id: '5',
  },
];

const dummyTrivia: Trivia[] = [
  {
    question: 'What is the?',
    answer: 'the',
  },
  {
    question: 'What is the largest planet in our solar system?',
    answer: 'Jupiter',
  },
  {
    question: 'What is the largest mammal on Earth?',
    answer: 'Blue whale',
  },
  {
    question: 'What is the highest mountain peak in the solar system?',
    answer: 'Olympus Mons on Mars',
  },
  {
    question: 'What is the boiling point of water in Kelvin?',
    answer: '373.15 K',
  },
];

function Trivia({ videoID, streamWindow, gameStart }: { videoID: string, streamWindow: any, gameStart: any }) {
  const [lastMessage, setLastMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [currentTrivia, setCurrentTrivia] = useState<Trivia>({
    question: '',
    answer: '',
  });
  const [trivia, setTrivia] = useState<Trivia[]>([]);
  const [startTime, setStartTime] = useState<any>(null);
  const [checks, setChecks] = useState<number>(0);
  const [asyncID, setAsyncID] = useState<any>(null);
  const [start, setStart] = useState<boolean>(false);
  /**
   * Returns the live chat ID of the live stream with the specified video ID.
   * @param {string} videoID - The ID of the live stream where the game is being hosted.
   * @returns {string} - The live chat ID of the chat playing the game.
   */
  async function getLiveChatId(videoID: string): Promise<string> {
    const {
      data: { liveChatId },
    } = await axios.get(
      `http://localhost:3001/api/live-chat-id?videoID=${videoID}`
    );
    return liveChatId;
  }

  /**
   * Fetches the chat messages from the YouTube API.
   * @param {string} liveChatId - The ID of the live chat to fetch messages from.
   * @returns {ChatMessage[]} - A promise resolving to an array of chat messages.
   */
  async function fetchChatMessages(liveChatId: string): Promise<ChatMessage[]> {
    const {
      data: { messages },
    } = await axios.get<{ messages: ChatMessage[] }>(
      `http://localhost:3001/api/chat-messages?liveChatId=${liveChatId}&startTime=${startTime}`
    );
    return messages;
  }

  /**
   * Parses the chat messages and adds them to the state.
   * @param {ChatMessage[]} messages - The array of chat messages to parse.
   */
  function parseNewMessages(messages: ChatMessage[]) {
    // Initialize the new messages array
    let newMessages: ChatMessage[] = [];
      
      // Iterate through the messages in reverse order
      for (let i = messages.length - 1; i >= 0; i--) {
        // If we've already seen this message, break out of the loop
        if (messages[i].id === lastMessage) {
          break;
        }
        // If the message contains the answer, add it to the new messages array
        if (messages[i].snippet.displayMessage.toLowerCase().includes(answer)) {
          newMessages.unshift(messages[i]);
        }
      }
      // Update the state with the new messages
      setLastMessage(newMessages[newMessages.length - 1].id);
      setChatMessages([...chatMessages, ...newMessages]);
  }

  /**
   * Saves a new trivia question and answer to local storage, clears the input fields,
   * and updates the current trivia in state.
   * @param {any} e - The event object triggering the function.
   * @return {void} This function does not return anything.
   */
  function saveTrivia(e: any) {
    e.preventDefault();
    setTrivia([{ question, answer }, ...trivia]);
    setCurrentTrivia({ question, answer });
    setQuestion('');
    setAnswer('');
    localStorage.setItem(
      'trivia',
      JSON.stringify([{ question, answer }, ...trivia])
    );
  }

  async function init() {
    const liveChatId = await getLiveChatId(videoID);
    let interval = setInterval(() => {
      if (checks < 4) {
      fetchChatMessages(liveChatId).then((newMessages) =>
        parseNewMessages(newMessages)
      );
      setChecks(checks + 1);
    } else {
      setChecks(0);
      clearInterval(asyncID);
    }
    }, 15000);
    setAsyncID(interval);
    setStart(true);
    setStartTime(Date.now());
    gameStart();
  }
  
  useEffect(() => {
    if (streamWindow && !streamWindow.closed) {
      streamWindow.postMessage({ trivia: currentTrivia, winners: chatMessages });
    }
  }, [currentTrivia, chatMessages, streamWindow]);

  // Retrieves the trivia from localStorage and initializes the state
  useEffect(() => {
    setChatMessages([...chatMessages, ...dummyMessages]);
    setLastMessage(dummyMessages[dummyMessages.length - 1].id);
    const storedTrivia = localStorage.getItem('trivia');
    setTrivia(
      (storedTrivia && JSON.parse(storedTrivia) && JSON.parse(storedTrivia).length > 0)
        ? JSON.parse(storedTrivia)
        : dummyTrivia
    );
  }, []);

  // TODO: Add a visualizer for the timer
  // TODO: Add a leaderboard
  // TODO: Style the page
  // TODO: Move dummy data to separate file

  return (
    <main className='trivia-view'>
      <h2 className='page-title'>Trivia Game</h2>
      <form className='trivia-form'>
        <h3 className='subtitle'>New Trivia</h3>
        <label className='trivia-label' htmlFor='question'>
          Question
        </label>
        <input autoComplete="off"
          className='trivia-input'
          type='text'
          id='question'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <label className='trivia-label' htmlFor='answer'>
          Answer
        </label>
        <input autoComplete="off"
          className='trivia-input'
          type='text'
          id='answer'
          value={answer}
          // TODO: Only do the lower case conversion when comparing to correct answer
          onChange={(e) => setAnswer(e.target.value.toLowerCase())}
        />
        <button className='trivia-button' onClick={question && answer ? saveTrivia : (e) => e.preventDefault()}>
          Save
        </button>
      </form>
      <div className='current-trivia'>
        <h3 className='subtitle'>Current Trivia</h3>
        <Timer initialTime={60} start={start} setStart={setStart} />
        <span className='current-question'>Q: {currentTrivia.question}</span>
        <span className='current-answer'>A: {currentTrivia.answer}</span>
        <button className='trivia-button' onClick={init} disabled={currentTrivia.question === '' || currentTrivia.answer === '' || !videoID.length}>
          Start Game
        </button>
      </div>
      <div className='trivias-container'>
        <h3 className='subtitle'>Saved Trivia</h3>
        <ul className='trivias'>
          {trivia.map((triv, i) => (
            <li key={i} className='trivia'>
              <span
                className='trivia-delete'
                onClick={(e) => {
                  e.stopPropagation();
                  let temp = trivia.slice();
                  temp.splice(i, 1);
                  localStorage.setItem('trivia', JSON.stringify(temp));
                  setTrivia(temp);
                }}
              >
                X
              </span>
              <span
                className='trivia-select'
                onClick={() => {
                  setCurrentTrivia(triv);
                }}
              >
                Q: {triv.question} <br />
                A: {triv.answer}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className='trivia-chats-container'>
        <h3 className='subtitle'>Winners</h3>
        <ul className='trivia-chats'>
          {chatMessages.map((msg, i) => (
            <li key={i + msg.id} className='trivia-chat'>
              <span className='trivia-username'>
                {msg.authorDetails.displayName.length > 20 ? msg.authorDetails.displayName.slice(0, 20) + '...' : msg.authorDetails.displayName}:
              </span>{' '}
              {msg.snippet.displayMessage}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default Trivia;
