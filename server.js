const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // Add this line
const app = express();

app.use(cors()); // Add this line
app.use(express.json());

const WEBHOOK_URL = 'YOUR_DISCORD_WEBHOOK_URL';

app.get('/', (req, res) => {
  res.send('Backend proxy server is running!');
});

app.post('/send-webhook', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).send('No content provided');
    }
    const discordRes = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!discordRes.ok) {
      const text = await discordRes.text();
      return res.status(500).send(`Discord webhook error: ${text}`);
    }
    res.send('Webhook sent successfully');
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
