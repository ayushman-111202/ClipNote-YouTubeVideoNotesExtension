const express = require('express');
const Model = require('../models/ClipModel');
const router = express.Router();

//add a new note
router.post('/add', (req, res) => {
    console.log(req.body);
    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
        });
});

//get all notes
router.get('/getall', (req, res) => {
    console.log(req.body);
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
        });
});

//delete a note
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