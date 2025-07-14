const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Make sure you installed node-fetch@2

const app = express();
const PORT = process.env.PORT || 10000;

// Replace with your actual Discord webhook URL
const DISCORD_WEBHOOK_URL = 'https://ptb.discord.com/api/webhooks/1363135609601917199/-XCwFzteRcZQW5u98yN9oP86P55-kaErK8QNP8m4p7eaTH1GTuRbaewg9qnx-ljs9J-k';

// Middleware
app.use(cors());
app.use(express.json());

// Root route (health check)
app.get('/', (req, res) => {
  res.send('Backend proxy server is running!');
});

// Webhook relay endpoint
app.post('/send-webhook', async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Missing content in request body.' });
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord webhook error:', errorText);
      return res.status(response.status).json({ error: 'Failed to send to Discord webhook.' });
    }

    res.json({ message: 'Webhook sent successfully.' });
  } catch (error) {
    console.error('Error sending webhook:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
