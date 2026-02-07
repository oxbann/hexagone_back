const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hexagone Académie API');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

let authRoutes;
let playersRoutes;
let adminRoutes;

try {
  authRoutes = require('./routes/auth');
  playersRoutes = require('./routes/players');
  adminRoutes = require('./routes/admin');
} catch (error) {
  console.error('Erreur chargement routes:', error);
}

// Routes
if (authRoutes) app.use('/api/auth', authRoutes);
if (playersRoutes) app.use('/api/players', playersRoutes);
if (adminRoutes) app.use('/api/admin', adminRoutes);

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Serveur backend lancé sur ${HOST}:${PORT}`);
});
