import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello World!',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [{"role": "system", "content": prompt}],
      temperature: 0,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    console.log('OpenAI API response:', response);

    if (response && response.choices && response.choices.length > 0) {
      res.status(200).send({
        bot: response.choices[0].message.content,
      });
    } else {
      res.status(500).send('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error.message || 'Something went wrong');
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
