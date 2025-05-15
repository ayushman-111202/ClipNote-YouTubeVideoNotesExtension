require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { checkAdminExists } = require('./middlewares/adminCheck');

// Import routers
const userRouter = require('./routers/userRouter');
const adminRouter = require('./routers/adminRouter');
const clipRouter = require('./routers/clipRouter');
const playlistRouter = require('./routers/playlistRouter');
const feedbackRouter = require('./routers/feedbackRouter');

const app = express();

// Middleware
const allowedOrigins = [
    "chrome-extension://ebpbepkddpjhhjgbdookboidhhmihbbp", // Allow all extensions (for development)
    "http://127.0.0.1:5000",
    "http://localhost:5000",
    "http://localhost:3000"
  ];


app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        // Check/create default admin after successful connection
        return checkAdminExists();
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// API Routes
app.use('/users', userRouter);
app.use('/admin', adminRouter);
app.use('/clips', clipRouter);
app.use('/playlists', playlistRouter);
app.use('/feedback', feedbackRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});