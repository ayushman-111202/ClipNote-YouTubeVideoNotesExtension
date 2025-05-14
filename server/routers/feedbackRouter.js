const express = require('express');
const Model = require('../models/FeedbackModel');
const router = express.Router();

//add a new feedback
router.post('/add', (req, res) => {
    console.log(req.body);
    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
        });
});

//get all feedbacks
router.get('/getall', (req, res) => {
    console.log(req.body);
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
        });
});

//delete a feedback
router.delete('/delete/:id', (req, res) => {
    console.log(req.body);
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
        });
});

module.exports = router;