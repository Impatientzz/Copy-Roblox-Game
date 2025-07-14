const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const WEBHOOK_URL = 'https://ptb.discord.com/api/webhooks/1363135609601917199/-XCwFzteRcZQW5u98yN9oP86P55-kaErK8QNP8m4p7eaTH1GTuRbaewg9qnx-ljs9J-k';

// Friendly root route
app.get('/', (req, res) => {
  res.send('Backend proxy server is running!');
});

// Webhook proxy route
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
