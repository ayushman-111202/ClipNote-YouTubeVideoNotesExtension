const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const userCheck = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const user = await UserModel.findById(decoded._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admins from accessing user routes
        if (user.role === 'admin') {
            return res.status(403).json({ 
                message: 'Access denied. User privileges required.' 
            });
        }

        // For regular users, ensure they're not accessing admin routes
        if (user.role !== 'admin' && req.originalUrl.includes('/admin')) {
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
        console.error('User check error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = userCheck;