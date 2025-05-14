const { Schema, model, Types } = require("../connection");

const clipSchema = new mongoose.Schema({
  videoId: { type: String, required: true }, // YouTube video ID
  startTime: { type: Number, required: true }, // in seconds
  endTime: { type: Number, required: true },   // in seconds
  note: { type: String },                      // optional user note
  createdAt: { type: Date, default: Date.now }
});

const playlistSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true }, // reference to the User model
  name: { type: String, required: true },  // playlist name
  description: { type: String },           // optional playlist description
  clips: [clipSchema],                     // array of clips
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('playlist', playlistSchema);
