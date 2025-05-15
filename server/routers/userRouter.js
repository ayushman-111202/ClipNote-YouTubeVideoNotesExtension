require('dotenv').config();
const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const userCheck = require('../middlewares/userCheck');
const verifyToken = require('../middlewares/verifyToken');

// Public routes (no authentication required)
router.post('/add', async (req, res) => {
    try {
        const { name, email, password, contact } = req.body;
        
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create username from email
        const username = email.split('@')[0];

        // Create new user
        const user = new UserModel({
            name,
            email,
            password,
            contact,
            username,
            role: 'user' // Default role
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Find user by email
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the user's role matches the requested role
        if (role && user.role !== role) {
            return res.status(403).json({ 
                message: `Invalid login attempt. Please use the correct login portal for your role.`
            });
        }

        // Verify password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token with user data
        const payload = {
            _id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            username: user.username
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });
        
        // Send complete response
        res.status(200).json({
            token,
            _id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            username: user.username
        });
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(500).json({ message: 'Server error during authentication' });
    }
});

// Verify token endpoint
router.get('/verify-token', verifyToken, async (req, res) => {
    try {
        // Token is already verified by middleware
        const user = await UserModel.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ valid: false, message: 'User not found' });
        }

        res.json({ 
            valid: true,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ valid: false, message: 'Error verifying token' });
    }
});

// Protected routes (authentication required)
router.use(userCheck);

// Get user dashboard data
router.get('/dashboard', async (req, res) => {
    try {
        const userId = req.user._id;

        // Get total clips
        const clips = await require('../models/ClipModel').find({ userId });
        const totalClips = clips.length;
        const recentClips = clips.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

        // Get total playlists
        const PlaylistModel = require('../models/PlaylistModel');
        const playlists = await PlaylistModel.find({ userId }).populate('clips');
        const totalPlaylists = playlists.length;
        const recentPlaylists = playlists.sort((a, b) => b.updatedAt - a.createdAt).slice(0, 5);

        // Calculate total watch time from HH:MM:SS format
        const watchTime = clips.reduce((total, clip) => {
            const getSeconds = (timeStr) => {
                const [hours, minutes, seconds] = timeStr.split(':').map(Number);
                return hours * 3600 + minutes * 60 + seconds;
            };
            
            const startSeconds = getSeconds(clip.startTime);
            const endSeconds = getSeconds(clip.endTime);
            return total + (endSeconds - startSeconds);
        }, 0);

        res.json({
            recentClips,
            recentPlaylists,
            stats: {
                totalClips,
                totalPlaylists,
                watchTime
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

// Update user profile
router.patch('/profile', async (req, res) => {
    try {
        const updates = { ...req.body };
        delete updates.role; // Prevent role updates through this endpoint
        delete updates.password; // Password updates should use a separate endpoint

        const user = await UserModel.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// Change password
router.post('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await UserModel.findById(req.user._id);

        const isValidPassword = await user.comparePassword(currentPassword);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
});

module.exports = router;