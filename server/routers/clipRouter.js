const express = require('express');
const Model = require('../models/ClipModel');
const PlaylistModel = require('../models/PlaylistModel');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

// Apply authentication middleware to all clip routes
router.use(verifyToken);

// Add a new clip (with optional playlist)
router.post('/add', async (req, res) => {
    try {
        const clipData = { ...req.body };
        const playlistId = clipData.playlistId;
        
        if (!clipData.title || !clipData.startTime || !clipData.endTime || !clipData.videoID || !clipData.userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Save the clip
        const newClip = await new Model(clipData).save();

        // If playlistId is provided, add the clip to the playlist
        if (playlistId) {
            await PlaylistModel.findByIdAndUpdate(
                playlistId,
                { 
                    $push: { clips: newClip._id },
                    $set: { updatedAt: new Date() }
                },
                { new: true }
            );
        }

        res.status(200).json(newClip);
    } catch (err) {
        console.error('Clip creation error:', err);
        res.status(500).json({ error: err.message || 'Error creating clip' });
    }
});

// Get all clips for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const clips = await Model.find({ userId: req.params.userId });
        res.status(200).json(clips);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get clips by playlist
router.get('/playlist/:playlistId', async (req, res) => {
    try {
        const clips = await Model.find({ playlistId: req.params.playlistId });
        res.status(200).json(clips);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get saved clips (clips without playlist)
router.get('/saved/:userId', async (req, res) => {
    try {
        const clips = await Model.find({ 
            userId: req.params.userId,
            playlistId: { $exists: false }
        });
        res.status(200).json(clips);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Move clip to a playlist
router.patch('/move/:clipId', async (req, res) => {
    try {
        const { playlistId } = req.body;
        
        // Update the clip with new playlist
        const updatedClip = await Model.findByIdAndUpdate(
            req.params.clipId,
            { 
                playlistId,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedClip) {
            return res.status(404).json({ message: 'Clip not found' });
        }

        // If moving to a playlist, add to playlist's clips array
        if (playlistId) {
            await PlaylistModel.findByIdAndUpdate(
                playlistId,
                { 
                    $addToSet: { clips: updatedClip._id },
                    $set: { updatedAt: new Date() }
                }
            );
        }

        res.status(200).json(updatedClip);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get all playlists containing a specific clip
router.get('/playlist/:clipId', async (req, res) => {
  try {
    const clip = await Model.findById(req.params.clipId);
    if (!clip) {
      return res.status(404).json({ message: 'Clip not found' });
    }

    const playlists = await PlaylistModel.find({ 
      clips: clip._id,
      userId: req.user._id 
    }).select('name description');

    res.status(200).json({ playlists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a clip
router.delete('/delete/:id', async (req, res) => {
    try {
        const clip = await Model.findById(req.params.id);
        if (!clip) {
            return res.status(404).json({ message: 'Clip not found' });
        }

        // If clip is in a playlist, remove it from the playlist
        if (clip.playlistId) {
            await PlaylistModel.findByIdAndUpdate(
                clip.playlistId,
                { 
                    $pull: { clips: clip._id },
                    $set: { updatedAt: new Date() }
                }
            );
        }

        await clip.deleteOne();
        res.status(200).json({ message: 'Clip deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;