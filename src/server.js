require('dotenv').config();
const express = require('express');
const cors = require('cors')

const app = express();
app.use(express.json());

const axios = require('axios');
app.use(cors());

const apiUrl = "https://api.openai.com/v1/chat/completions";

const port = 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});

app.post('/completions', async (req, res) => {
  console.log(req.body);
  const prevChats = req.body.chats;

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a tutor that helps users study languages. You adapt to the user's proficiency level. You should ask if they prefer conversational practice with corrections OR structured lessons.",
          },
          {
            role: "assistant",
            content:
              "Hello! As an AI language tutor, I am designed to assist people in learning new languages. I can help with various aspects of language learning, such as grammar, vocabulary, pronunciation, and conversation skills. I adapt to the learner's current level of proficiency, their learning goals, and their preferred learning style in order to provide personalized assistance. Let's have fun learning! To start, which language are you interested in and what's your current proficiency level?",
          },
          ...prevChats,
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const reply = response.data.choices[0].message;
    res.send({message: reply});
  } catch (error) {
    console.log(error);
    console.log(error.response.data);
    res.status(500).send({ error: "An error occurred" });
  }
});

