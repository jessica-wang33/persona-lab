import { parquetRead, asyncBufferFromFile } from 'hyparquet/src/node.js';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PARQUET_PATH = join(__dirname, '../data/personas.parquet');

let cachedRows = null;

async function loadPersonas() {
  if (cachedRows) return cachedRows;

  const file = await asyncBufferFromFile(PARQUET_PATH);
  const rows = [];

  await parquetRead({
    file,
    rowFormat: 'object',
    onComplete: (data) => rows.push(...data),
  });

  cachedRows = rows.map(normalizeRow);
  console.log(`Loaded ${cachedRows.length} personas from parquet.`);
  return cachedRows;
}

function normalizeRow(row) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    if (typeof v === 'bigint') out[k] = Number(v);
    else out[k] = v;
  }
  return out;
}

export async function fetchPersonasByAge(minAge, maxAge, count) {
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

  return inRange.sort(() => Math.random() - 0.5).slice(0, count);
}
