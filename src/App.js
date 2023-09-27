import './App.scss';
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.css";
import {Form, Button} from 'react-bootstrap';

/*TODO:
/---BUGS and IMPROVEMENTS:
/... Fix the verification method for redundancy (two methods)
/... Check for redundancy in chat update (checking value and message while passing into useEffect)
/... Check for existing usernames and emails before signing them up (username in use, email exists)

/---FEATURE ADDITIONS:
/... Submit on enter press
/... Show typing while waiting for load, potentially stream text
/... Add text timestamp
*/

function App() {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]); //Stores the user's cookie
  const [username, setUsername] = useState(""); //Stores the user's username
  const [value, setValue] = useState(""); //Stores the user's input
  const [message, setMessage] = useState(null); //Stores the response from the server
  const [previousChats, setPreviousChats] = useState([]); //Stores the previous chats

  //Sends the user's input to the server and stores the response
  const getMessages = async() => {
    //Stores the previous chats and the new user's input
    const chats = [...previousChats, {role: 'user', content: value}]; 
    
    try {
      const response = await axios.post("http://localhost:3001/completions", {chats});
      setMessage(response);
    } catch (error) {
      console.log(error)
    }
  }

  //Verifies that the user is logged in, sends them to log in page otherwise
  useEffect(() => {
    const verifyCookie = async() => {
      if (!cookies.token) {
        navigate('/login');
      }
      const { data } = await axios.post(
        "http://localhost:3001",
        {},
        { withCredentials: true}
      );

      //Sets the users chat history and name
      const { status, user, chatHistory } = data;
      setUsername(user);
      setPreviousChats(chatHistory);

      //Shows welcome popup on log in
      return status
        ? toast(`Hello ${user}!`, {position: "top-right"})
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [])

  //If the cookies, or username changes, verifies if they are still logged in
  useEffect(() => {
    const verifyCookie = async() => {
      if (!cookies.token) {
        navigate('/login');
      }

      const { data } = await axios.post(
        "http://localhost:3001",
        {},
        { withCredentials: true}
      );

      const { status, user, chatHistory } = data;
      console.log(chatHistory);
      setUsername(user);

      return status
        ? {}
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();

  }, [cookies, username, navigate, removeCookie])

  //Updates the chat History when the server responds
  useEffect(() => { 
    const updateChatHistory = async () => {
      //Passes in the user to look for and the chats to add history
      const toUpdate = {
        filter: { username: username },
        update: {
          $push: {
            chatHistory: {
              $each: [
                {
                  role: "user",
                  content: value,
                },
                {
                  role: message.data.message.role,
                  content: message.data.message.content,
                },
              ],
            },
          },
        },
      };

      //Calls update 
      const { data } = await axios.post(
        "http://localhost:3001/update",
        {
          ...toUpdate
        },
        { withCredentials: true }
      );
    };

    //Updates the local chat history if both message and value
    if (message && value) {
      setPreviousChats((previousChats) => [
        ...previousChats,
        {
          role: "user",
          content: value,
        },
        {
          role: message.data.message.role,
          content: message.data.message.content,
        },
      ]);
      updateChatHistory();
      setValue("");
      setMessage(null);
    }
  }, [previousChats, message, value, username])

  //Logs the user out and removes verification
  const Logout = () =>
  {
    removeCookie("token");
    navigate("/login");
  };

  return (
    <div className="d-flex flex-column App">
      <div className="App-header">
        <Button variant="primary" type="button" onClick={Logout}>Logout</Button>
        <p>Welcome {username}</p>
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
      <ToastContainer />
    </div>
  );
}

export default App;
