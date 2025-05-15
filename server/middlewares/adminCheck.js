const User = require('../models/UserModel');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const checkAdminExists = () => {
    // Get admin credentials from environment variables or use fallbacks
    const adminName = process.env.DEFAULT_ADMIN_NAME || 'Default Admin';
    const adminContact = process.env.DEFAULT_ADMIN_CONTACT || '1234567890';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
    const adminUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
    
    // Validate required credentials
    if (!adminPassword) {
        return Promise.reject(new Error('DEFAULT_ADMIN_PASSWORD environment variable is required'));
    }
    
    // Check if any admin user exists
    return User.findOne({ role: 'admin' })
        .then((adminExists) => {
            if (!adminExists) {
                console.log('No admin user found. Creating default admin...');
                
                // Create default admin user
                const defaultAdmin = new User({
                    name: adminName,
                    contact: adminContact,
                    password: adminPassword,
                    email: adminEmail,
                    username: adminUsername,
                    role: 'admin'
                });
                
                return defaultAdmin.save()
                    .then(() => {
                        console.log('Default admin user created successfully!');
                        return Promise.resolve();
                    });
            } else {
                console.log('Admin user already exists. Skipping default admin creation.');
                return Promise.resolve();
            }
        })
        .catch((error) => {
            console.error('Error checking/creating admin user:', error);
            return Promise.reject(error);
        });
};

const adminCheck = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user and verify role
        const user = await UserModel.findById(decoded._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ 
                message: 'Access denied. Admin privileges required.' 
            });
        }

        // Add user info to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('Admin check error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { checkAdminExists, adminCheck };