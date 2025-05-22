// feedbackRouter.js
const express = require('express')
const Model   = require('../models/FeedbackModel')
const router  = express.Router()

// Add a new feedback
router.post('/add', async (req, res) => {
  try {
    const fb = new Model(req.body)
    const saved = await fb.save()
    res.status(201).json(saved)
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message })
  }
})

// Get all feedbacks, with optional filters ?category=...&stars=...
router.get('/getall', async (req, res) => {
  try {
    const { category, stars } = req.query
    const filter = {}
    if (category) filter.category = category
    if (stars)     filter.stars     = Number(stars)

    const list = await Model.find(filter).sort({ createdAt: -1 })
    res.status(200).json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch feedbacks' })
  }
})

// Delete a feedback
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await Model.findByIdAndDelete(req.params.id)
    res.status(200).json(deleted)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete feedback' })
  }
})

module.exports = router
