// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const loanRoutes = require('./routes/loanRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/v1', loanRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
