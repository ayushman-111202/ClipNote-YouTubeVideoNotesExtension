const express = require('express');
const router = express.Router();
const { adminCheck } = require('../middlewares/adminCheck');
const User = require('../models/UserModel');
const Feedback = require('../models/FeedbackModel');

// Apply adminCheck middleware to all admin routes
router.use(adminCheck);

// Get all users (admin only)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Update user role (super admin only)
router.patch('/users/:id/role', async (req, res) => {
    try {
        // Check if the requesting admin is a super admin
        if (req.user.email !== process.env.DEFAULT_ADMIN_EMAIL) {
            return res.status(403).json({ 
                message: 'Access denied. Only super admin can modify user roles.' 
            });
        }

        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Error updating user role' });
    }
});

// Register new admin (super admin only)
router.post('/register', async (req, res) => {
    try {
        // Check if the requesting admin is a super admin
        if (req.user.email !== process.env.DEFAULT_ADMIN_EMAIL) {
            return res.status(403).json({ 
                message: 'Access denied. Only super admin can register new admins.' 
            });
        }

        const { name, email, password, contact } = req.body;
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists with this email' });
        }

        // Create username from email
        const username = email.split('@')[0];

        // Create new admin user
        const admin = new User({
            name,
            email,
            password,
            contact,
            username,
            role: 'admin'
        });

        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ message: 'Error registering admin' });
    }
});

// Delete user (super admin only)
router.delete('/users/:id', async (req, res) => {
    try {
        // Check if the requesting admin is a super admin
        if (req.user.email !== process.env.DEFAULT_ADMIN_EMAIL) {
            return res.status(403).json({ 
                message: 'Access denied. Only super admin can delete users.' 
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('-password');

        res.json({
            totalUsers,
            totalAdmins,
            recentUsers,
            adminInfo: req.user // From adminCheck middleware
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Error fetching admin stats' });
    }
});

// Update all user roles except admin (admin only)
router.post('/update-all-roles', async (req, res) => {
    try {
        // Update all users to role 'user' except the admin
        await User.updateMany(
            { email: { $ne: 'admin@example.com' } },
            { role: 'user' }
        );

        res.json({ message: 'All user roles updated successfully' });
    } catch (error) {
        console.error('Error updating user roles:', error);
        res.status(500).json({ message: 'Error updating user roles' });
    }
});

// FEEDBACK MANAGEMENT ROUTES

// Get all feedbacks (admin only)
router.get('/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ message: 'Error fetching feedbacks' });
    }
});

// Delete feedback (admin only)
router.delete('/feedback/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ message: 'Error deleting feedback' });
    }
});

module.exports = router;