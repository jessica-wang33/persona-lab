const axios = require('axios');

const HF_BASE = 'https://datasets-server.huggingface.co';
const DATASET = 'nvidia/Nemotron-Personas-USA';
// HF filter API has a bug with compound AND conditions on this dataset.
// Workaround: filter by minAge only via API, then apply maxAge in JS.
const FETCH_BATCH = 100; // max per request

async function fetchPersonasByAge(minAge, maxAge, count) {
  const where = `"age" >= ${minAge}`;

  // Get total count of rows matching minAge filter
  const countRes = await axios.get(`${HF_BASE}/filter`, {
    params: { dataset: DATASET, config: 'default', split: 'train', where, offset: 0, length: 1 },
  });

  const total = countRes.data.num_rows_total;
  if (!total) throw new Error('No personas found. The dataset may still be indexing — try again in a moment.');

  // Fetch up to 500 rows from a random offset, then JS-filter by maxAge
  const needToFetch = Math.min(500, total);
  const maxOffset = Math.max(0, total - needToFetch);
  const offset = Math.floor(Math.random() * maxOffset);

  const res = await axios.get(`${HF_BASE}/filter`, {
    params: {
      dataset: DATASET,
      config: 'default',
      split: 'train',
      where,
      offset,
      length: FETCH_BATCH,
    },
  });

  const rows = res.data.rows.map((r) => r.row).filter((r) => r.age <= maxAge);

  if (rows.length < count) {
    throw new Error(
      `Only found ${rows.length} personas in age range ${minAge}–${maxAge}. Try a wider range or fewer people.`
    );
  }

  // Random sample exactly `count`
  return rows.sort(() => Math.random() - 0.5).slice(0, count);
}

module.exports = { fetchPersonasByAge };
