const express = require('express');
const { generateAvatar } = require('../services/minimax');

const router = express.Router();

router.post('/', async (req, res) => {
  const { persona } = req.body;
  if (!persona) return res.status(400).json({ error: 'persona is required' });

  try {
    const imageUrl = await generateAvatar(persona);
    res.json({ imageUrl });
  } catch (err) {
    console.error('Avatar generation error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate avatar' });
  }
});

module.exports = router;
