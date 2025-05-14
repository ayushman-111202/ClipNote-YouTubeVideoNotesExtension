// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const verifyToken = (req, res, next) => {
//     const token = req.headers['x-auth-token'];

//     if (!token) {
//         return res.status(403).json({ message: 'Authentication token required' });
//     }
//     else {
//         jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
//             if (err) {
//                 console.log(err);
//                 res.status(500).json(err);
//             }
//             else {
//                 req.user = payload;
//                 next();
//             }
//         });
//     }
// }

// module.exports = verifyToken;


const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        req.user = payload;
        next();
    });
};

module.exports = verifyToken;
