require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'https://sqd48-camera.vercel.app'
];

// CORS Setup
const corsOptions = {
  origin: function (origin, callback) {
    console.log('Incoming request from origin:', origin); // helpful log
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`❌ Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Base route
app.get('/', (req, res) => {
  res.send('✅ Backend is working');
});

// MongoDB connection
mongoose.connect(process.env.mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// MongoDB connection test route
app.get('/mongodbconnection', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.send('✅ Connected to DB');
  } else {
    res.send('❌ Not connected to DB');
  }
});

// API routes
app.use('/api', routes);

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Server running on PORT: ${port}`);
  });
}

module.exports = app;
