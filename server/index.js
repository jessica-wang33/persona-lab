import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cohortRouter from './routes/cohort.js';
import avatarRouter from './routes/avatar.js';
import chatRouter from './routes/chat.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/cohort', cohortRouter);
app.use('/api/avatar', avatarRouter);
app.use('/api/chat', chatRouter);

app.get('/api/health', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
