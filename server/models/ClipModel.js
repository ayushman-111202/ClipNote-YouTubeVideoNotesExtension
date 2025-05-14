const { Schema, model, Types } = require('../connection');

const clipSchema = new Schema({
    title: { type: String },                                                       
    videoID: { type: String }, 
    note : { type: String },                                                    
    startTime: { type: String },                                                   
    endTime: { type: String },                                                     
    playlist: { type: String },                                                        
    createdAt: { type: Date, default: Date.now },                                 
    updatedAt: { type: Date, default: Date.now }         
    // userId: { type: Types.ObjectId, required: true, ref: 'users' }                
});

module.exports = model('notes', clipSchema);
