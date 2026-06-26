require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');

const cohortRouter = require('./routes/cohort');
const avatarRouter = require('./routes/avatar');
const chatRouter = require('./routes/chat');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/cohort', cohortRouter);
app.use('/api/avatar', avatarRouter);
app.use('/api/chat', chatRouter);

app.get('/api/health', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
