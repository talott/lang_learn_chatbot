import './App.scss';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.css";
import {Form, Button} from 'react-bootstrap';

function App() {

  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);

  const getMessages = async() => {
    const chats = [...previousChats, {role: 'user', content: value}];
    try {
      const response = await axios.post("http://localhost:3001/completions", {chats});
      setMessage(response);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (message && value) {
      setPreviousChats(previousChats => 
        ([...previousChats, 
          {
              role: 'user',
              content: value
          },
          {
            role: message.data.message.role,
            content: message.data.message.content
          }
      ]))
      setValue("");
      setMessage(null);
    }
  }, [message, value])

  console.log(value, message, previousChats)
  return (
    <div className="d-flex flex-column App">
      <div className="App-header">
        <h1>Language Learning Chatbot</h1>
        <h2>I can help you learn almost any language!</h2>
      </div>

      <div className="d-flex flex-column App-body">
        <div className="speech-assistant">
          Hello! As an AI language tutor, I am designed to assist people in
          learning new languages. I can help with various aspects of language
          learning, such as grammar, vocabulary, pronunciation, and conversation
          skills. I adapt to the learner's current level of proficiency, their
          learning goals, and their preferred learning style in order to provide
          personalized assistance. Let's have fun learning! To start, which
          language are you interested in and what's your current proficiency
          level?
        </div>

        {/*Displays the previous chats*/}
        {previousChats.map((chat, index) => (
          <div key={index} className={`speech-${chat.role}`}>
            <p>{chat.content}</p>
          </div>
        ))}
      </div>

      <div className="App-input">
        <Form className="d-flex">
          <Form.Control
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type your message here..."
          />
          <Button variant="primary" type="button" onClick={getMessages}>
            Send
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
