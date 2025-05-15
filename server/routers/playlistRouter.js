const express = require('express');
const Model = require('../models/PlaylistModel');
const router = express.Router();

// Add a new playlist
router.post('/add', async (req, res) => {
    try {
        const playlist = new Model({
            ...req.body,
            clips: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const result = await playlist.save();
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get all playlists (optionally, you can filter by user later)
router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get playlists by userId with populated clips
router.get('/getbyuser/:userId', async (req, res) => {
    try {
        const result = await Model.find({ userId: req.params.userId })
            .populate('clips')
            .sort({ updatedAt: -1 });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get a single playlist by id with populated clips
router.get('/getbyid/:id', async (req, res) => {
    try {
        const result = await Model.findById(req.params.id)
            .populate('clips');
        if (!result) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Add a new clip to an existing playlist
router.post('/addclip/:id', (req, res) => {
    Model.findByIdAndUpdate(
        req.params.id,
        { $push: { clips: req.body } },
        { new: true } // return updated document
    )
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Update playlist details
router.patch('/update/:id', async (req, res) => {
    try {
        const updates = {
            ...req.body,
            updatedAt: new Date()
        };
        delete updates.clips; // Prevent direct modification of clips array
        delete updates.userId; // Prevent changing owner

        const result = await Model.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).populate('clips');
        
        if (!result) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a playlist
router.delete('/delete/:id', async (req, res) => {
    try {
        const result = await Model.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;