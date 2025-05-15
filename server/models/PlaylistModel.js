const { Schema, model, Types } = require("../connection");

const playlistSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'users', required: true },
  name: { type: String, required: true },
  description: { type: String },
  clips: [{ type: Types.ObjectId, ref: 'notes' }], // Reference to ClipModel
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = model('playlist', playlistSchema);
