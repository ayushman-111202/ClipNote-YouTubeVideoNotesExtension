//import express and cors
const express = require('express');
const UserRouter = require('./routers/userRouter');
const ClipRouter = require('./routers/clipRouter');
const FeedbackRouter = require('./routers/feedbackRouter');
const VerifyToken = require('./middlewares/verifyToken');
const checkAdminExists = require('./middlewares/adminCheck');
const cors = require('cors');
require('dotenv').config();

//creating an express app
const app = express();
const port = process.env.PORT || 5000;

// Check for required environment variables
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is required');
    process.exit(1);
}

// Connect to database and check for admin user
checkAdminExists()
    .then(() => {
        console.log('Admin check complete');
        
        //middleware
        app.use(cors({
            origin: '*'
        }));
        app.use(express.json());
        app.use('/clips', ClipRouter);
        app.use('/users', UserRouter);
        app.use('/feedbacks', FeedbackRouter);

        // Protected route for token verification
        app.get('/verify-token', VerifyToken, (req, res) => {
            res.json({ valid: true, user: req.user });
        });

        //router or end points
        app.get('/', (req, res) => {
            res.send('Response from Server');
        });

        //starting the server
        app.listen(port, () => {
            console.log(`Server Started on port ${port}`); 
        });
    })
    .catch((error) => {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    });