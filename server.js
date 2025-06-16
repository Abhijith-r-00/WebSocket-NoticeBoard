// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const Notice = require('./models/notice');
require('dotenv').config();
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*', // Change this to your frontend domain in production
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


const path = require('path'); // Add at the top

// Serve static files

// Custom routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/board', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'noticeboard.html'));
});




// MongoDB Atlas Connection
mongoose.connect('mongodb+srv://abhijithgru:zsryY6UMFTCTRZDh@cluster0.xorwhmd.mongodb.net/noticeBoard?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ MongoDB Atlas connection error:', err));

// REST API - Fetch all notices
app.get('/notices', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// Socket.IO - Real-time event handling
io.on('connection', (socket) => {
  console.log('🟢 New client connected');

  socket.on('new-notice', async (data) => {
    try {
      const newNotice = new Notice(data);
      const saved = await newNotice.save();
      io.emit('new-notice', saved);
      console.log('📢 New notice broadcasted:', saved.title);
    } catch (err) {
      console.error('❌ Error saving notice:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
