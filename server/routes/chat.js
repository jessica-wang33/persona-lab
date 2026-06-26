const express = require('express');
const { chatWithPersona } = require('../services/minimax');

const router = express.Router();

router.post('/', async (req, res) => {
  const { persona, messages } = req.body;
  if (!persona || !messages) {
    return res.status(400).json({ error: 'persona and messages are required' });
  }

  try {
    const reply = await chatWithPersona(persona, messages);
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to get response' });
  }
});

module.exports = router;
