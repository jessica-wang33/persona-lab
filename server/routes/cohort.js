import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { fetchPersonasByAge } from '../services/personas.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { count, minAge, maxAge } = req.body;

  if (!count || !minAge || !maxAge) {
    return res.status(400).json({ error: 'count, minAge, and maxAge are required' });
  }
  if (count < 1 || count > 50) {
    return res.status(400).json({ error: 'count must be between 1 and 50' });
  }
  if (minAge >= maxAge) {
    return res.status(400).json({ error: 'minAge must be less than maxAge' });
  }

  try {
    const personas = await fetchPersonasByAge(minAge, maxAge, count);
    const result = personas.map((p) => ({ ...p, id: uuidv4() }));
    res.json({ personas: result });
  } catch (err) {
    console.error('Cohort generation error:', err);
    res.status(500).json({ error: err.message || String(err) || 'Failed to generate cohort' });
  }
});

export default router;
