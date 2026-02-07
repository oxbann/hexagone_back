const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const playersRoutes = require('./routes/players');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hexagone Académie API');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur le port ${PORT}`);
});
