const express = require('express');
const Model = require('../models/PlaylistModel');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

// Apply authentication middleware to all playlist routes
router.use(verifyToken);

// Add a new playlist
router.post('/add', async (req, res) => {
    try {
        const playlist = new Model({
            ...req.body,
            userId: req.user._id, // Add the authenticated user's ID
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

// Get playlists by userId with populated clips, search, and pagination
router.get('/getbyuser/:userId', async (req, res) => {
    try {
        const { search = '', sortBy = 'updatedAt', order = 'desc', page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        // Build query
        const query = { userId: req.params.userId };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const total = await Model.countDocuments(query);

        // Get playlists with pagination and sorting
        const result = await Model.find(query)
            .populate('clips')
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            playlists: result,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
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