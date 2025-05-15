const { Schema, model, Types } = require('../connection');

const clipSchema = new Schema({
    title: { type: String, required: true },                                                       
    videoID: { type: String, required: true }, 
    note: { type: String },                                                    
    startTime: { type: String, required: true },                                                   
    endTime: { type: String, required: true },                                                     
    userId: { type: Types.ObjectId, required: true, ref: 'users' },
    playlistId: { type: Types.ObjectId, ref: 'playlist' },  // Optional, if not set, it's in saved clips                                                      
    createdAt: { type: Date, default: Date.now },                                 
    updatedAt: { type: Date, default: Date.now }         
});

module.exports = model('notes', clipSchema);
