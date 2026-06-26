const axios = require('axios');

const HF_BASE = 'https://datasets-server.huggingface.co';
const DATASET = 'nvidia/Nemotron-Personas-USA';

async function fetchPersonasByAge(minAge, maxAge, count) {
  const where = `age >= ${minAge} AND age <= ${maxAge}`;

  // First get total count in range
  const countRes = await axios.get(`${HF_BASE}/filter`, {
    params: {
      dataset: DATASET,
      config: 'default',
      split: 'train',
      where,
      offset: 0,
      length: 1,
    },
  });

  const total = countRes.data.num_rows_total;
  if (total === 0) throw new Error('No personas found in that age range.');

  // Pick a random offset so we get variety
  const maxOffset = Math.max(0, total - count);
  const offset = Math.floor(Math.random() * maxOffset);

  const fetch = Math.min(count * 4, 500); // fetch extra for random sampling
  const res = await axios.get(`${HF_BASE}/filter`, {
    params: {
      dataset: DATASET,
      config: 'default',
      split: 'train',
      where,
      offset,
      length: fetch,
    },
  });

  const rows = res.data.rows.map((r) => r.row);

  // Random sample exactly `count` from results
  const shuffled = rows.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

module.exports = { fetchPersonasByAge };
