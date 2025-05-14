require('dotenv').config();
const express = require('express');
const Model = require('../models/UserModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');


//add a new user
router.post('/add', (req, res) => {
    console.log(req.body);
    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get all users
router.get('/getall', (req, res) => {
    console.log(req.body);
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
        });
});

//find user
router.get('/getuser', verifyToken, (req, res) => {

    const { _id } = req.user;

    Model.findById(_id)
        .then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json(err)
        });
});

//get users by id
router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

//delete a user
router.delete('/delete/:id', (req, res) => {
    console.log(req.body);
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
        });
});

// router.post('/authenticate', (req, res) => {
//     Model.findOne(req.body)
//         .then((result) => {
//             if (result) {
//                 // email and password matched
//                 // generate token

//                 const { _id, email, password, role } = result;
//                 const payload = { _id, email, password, role }

//                 jwt.sign(
//                     payload,
//                     process.env.JWT_SECRET,
//                     { expiresIn: '6h' },
//                     (err, token) => {
//                         if (err) {
//                             console.log(err);
//                             res.status(500).json(err);
//                         } else {
//                             res.status(200).json({ token });
//                         }
//                     }
//                 )

//             } else {
//                 res.status(401).json({ message: 'Invalid email or password' });
//             }
//         }).catch((err) => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// });

// Modified part of userRouter.js - updated authentication route

router.post('/authenticate', (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    Model.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Check password
            user.comparePassword(password)
                .then((isPasswordValid) => {
                    if (!isPasswordValid) {
                        return res.status(401).json({ message: 'Invalid email or password' });
                    }

                    // Generate token
                    const { _id, role } = user;
                    const payload = { _id, email, role };

                    jwt.sign(
                        payload,
                        process.env.JWT_SECRET,
                        { expiresIn: '6h' },
                        (err, token) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ message: 'Error generating token' });
                            }
                            res.status(200).json({ token });
                        }
                    );
                })
                .catch((err) => {
                    console.error('Password comparison error:', err);
                    res.status(500).json({ message: 'Server error during authentication' });
                });
        })
        .catch((err) => {
            console.error('Authentication error:', err);
            res.status(500).json({ message: 'Server error during authentication' });
        });
});

module.exports = router;