const express = require('express');
const router = express.Router();
const Users = require('./models/users');
const Camera = require('./models/data');
const SellCamera = require('./models/selldata');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Users data requests
router.get('/users', async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Signup
router.post('/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' }); // 409 Conflict status code
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({ username, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false });
    res.status(200).json({ message: 'User added successfully', token });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false });
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Logout details
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: false });
  res.status(200).json({ message: 'Logout successful' });
});

// Camera data requests
router.get('/cameras', async (req, res) => {
  try {
    const cameras = await Camera.find();
    res.json(cameras);
  } catch (error) {
    console.error('Error retrieving cameras:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/cameras', async (req, res) => {
  try {
    const { name, imgurl, price } = req.body;
    const newCamera = new Camera({ name, imgurl, price });
    await newCamera.save();
    res.status(200).json({ message: 'Camera added successfully' });
  } catch (error) {
    console.error('Error adding camera:', error);
    res.status(500).json({ error: 'Failed to add camera' });
  }
});

// SellCamera Data requests
router.get('/sell-cameras', async (req, res) => {
  try {
    const sellCameras = await SellCamera.find();
    res.json(sellCameras);
  } catch (error) {
    console.error('Error retrieving sell cameras:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/sell-cameras', async (req, res) => {
  try {
    const { name, imgurl, price, created_by } = req.body;
    const newSellCamera = new SellCamera({ name, imgurl, price,created_by });
    await newSellCamera.save();
    res.status(200).json(newSellCamera);
  } catch (error) {
    console.error('Error adding sell camera:', error);
    res.status(500).json({ error: 'Failed to add sell camera' });
  }
});

router.put('/sell-cameras/:id', async (req, res) => {
  try {
    const { name, imgurl, price } = req.body;
    const { id } = req.params;
    await SellCamera.findByIdAndUpdate(id, { name, imgurl, price });
    res.json({ message: 'Sell camera updated successfully' });
  } catch (error) {
    console.error('Error updating sell camera:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/sell-cameras/:id', async (req, res) => {
  try {
    const cameraId = req.params.id;
    const deletedCamera = await SellCamera.findByIdAndDelete(cameraId);
    if (!deletedCamera) {
      return res.status(404).json({ message: 'Camera not found' });
    }
    res.status(200).json({ message: 'Camera removed successfully' });
  } catch (error) {
    console.error('Error removing camera:', error);
    res.status(500).json({ error: 'Failed to remove camera' });
  }
});

router.get('/update-sell-camera/:id', (req, res) => {
  res.sendFile(__dirname + '/path/to/UpdateSellCameraForm.jsx');
});

module.exports = router;
