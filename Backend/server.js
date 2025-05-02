require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const mongoose = require('mongoose');
const routes = require("./routes");
const cors = require('cors');
const cookieParser = require("cookie-parser");

// Configure CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://camera-frontend.onrender.com'  // ✅ Replace with your actual frontend URL
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

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/', routes);

// Connect to MongoDB
mongoose.connect(process.env.mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// MongoDB connection check route
app.get('/mongodbconnection', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      res.send("Connected to DB");
    } else {
      res.send("Not connected to DB");
    }
  } catch (err) {
    res.send("Connection to DB failed");
  }
});

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Server running on PORT: ${port}`);
  });
}

module.exports = app;
