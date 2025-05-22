// FeedbackModel.js
const { Schema, model } = require('../connection')

const feedbackSchema = new Schema({
  description: { type: String, required: true },
  stars:       { type: Number, required: true, min: 1, max: 5 },
  category:    { type: String, required: true, enum: ['Bug Report','Feature Request','General'] },
  email:       { type: String, required: true },
  createdAt:   { type: Date, default: Date.now }
})

module.exports = model('Feedback', feedbackSchema)
