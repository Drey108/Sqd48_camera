require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🌐 Incoming request from:', origin);

    const allowed =
      !origin ||
      origin.includes('localhost') ||
      /^https:\/\/.*\.vercel\.app$/.test(origin);

    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error(`❌ Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
};

// 🧩 Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// 🌐 Health check route
app.get('/', (req, res) => {
  res.send('✅ Backend is working');
});

// 🔗 MongoDB connection
mongoose.connect(process.env.mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 🧪 DB test route
app.get('/mongodbconnection', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.send('✅ Connected to DB');
  } else {
    res.send('❌ Not connected to DB');
  }
});

// 📦 API routes
app.use('/api', routes);

// 🚀 Launch server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Server running on PORT: ${port}`);
  });
}

module.exports = app;
