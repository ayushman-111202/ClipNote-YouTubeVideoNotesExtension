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
        res.status(200).json({ token, role: user.role });
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(500).json({ message: 'Server error during authentication' });
    }
});

// Verify token endpoint
// router.get('/verify-token', async (req, res) => {
//     try {
//         // Get token from header
//         const token = req.header('Authorization')?.replace('Bearer ', '');
        
//         if (!token) {
//             return res.json({ valid: false });
//         }

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
//         // Find user
//         const user = await UserModel.findById(decoded._id);
        
//         if (!user) {
//             return res.json({ valid: false });
//         }

//         res.json({ valid: true, user: { id: user._id, role: user.role } });
//     } catch (error) {
//         console.error('Token verification error:', error);
//         res.json({ valid: false });
//     }
// });

// Protected routes (authentication required)
router.use(userCheck);

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

// Verify token endpoint
router.get('/verify-token', verifyToken, (req, res) => {
    res.json({ 
        valid: true, 
        user: {
            _id: req.user._id,
            email: req.user.email,
            role: req.user.role,
            name: req.user.name,
            username: req.user.username
        }
    });
});

module.exports = router;