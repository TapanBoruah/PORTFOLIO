const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve Uploaded Images Statically
const path = require('path');
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Successfully connected to MongoDB.'))
.catch(err => {
  console.error('MongoDB connection failure details:', err.message);
  process.exit(1);
});

// Import Routes
const authRoutes = require('./routes/auth');
const skillsRoutes = require('./routes/skills');
const projectsRoutes = require('./routes/projects');
const educationRoutes = require('./routes/education');
const achievementsRoutes = require('./routes/achievements');
const messagesRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');
const profileRoutes = require('./routes/profile');

// Bind API Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/profile', profileRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Tapan Boruah Portfolio API is active');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
