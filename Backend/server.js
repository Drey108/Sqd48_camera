require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3001;

// ✅ CORS Configuration for Render deployment and local dev
const allowedOrigins = [
  'http://localhost:5173', // Local frontend (Vite)
  'https://sqd48-camera.onrender.com/' // 🔁 Replace with your actual frontend URL on Render
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// ✅ Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// ✅ Routes
app.use('/', routes);

// ✅ MongoDB connection
mongoose.connect(process.env.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ DB connection test endpoint
app.get('/mongodbconnection', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.send(isConnected ? 'Connected to DB' : 'Not connected to DB');
});

// ✅ Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
}

module.exports = app;
