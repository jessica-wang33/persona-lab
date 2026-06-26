const parquet = require('parquetjs-lite');
const path = require('path');

const PARQUET_PATH = path.join(__dirname, '../data/personas.parquet');

let cachedRows = null;

async function loadPersonas() {
  if (cachedRows) return cachedRows;

  const reader = await parquet.ParquetReader.openFile(PARQUET_PATH);
  const cursor = reader.getCursor();

  const rows = [];
  let record;
  while ((record = await cursor.next()) !== null) {
    rows.push(record);
  }
  await reader.close();

  cachedRows = rows;
  console.log(`Loaded ${rows.length} personas from parquet.`);
  return cachedRows;
}

async function fetchPersonasByAge(minAge, maxAge, count) {
  const all = await loadPersonas();
  const inRange = all.filter((r) => r.age >= minAge && r.age <= maxAge);

  if (inRange.length === 0) {
    throw new Error(`No personas found in age range ${minAge}–${maxAge}.`);
  }
  if (inRange.length < count) {
    throw new Error(
      `Only ${inRange.length} personas found in age range ${minAge}–${maxAge}. Try a wider range or fewer people.`
    );
  }

  // Random sample without replacement
  const shuffled = inRange.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

module.exports = { fetchPersonasByAge };
