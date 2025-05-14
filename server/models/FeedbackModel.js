const { Schema, model} = require('../connection');

const mySchema = new Schema({
    description : { type : String, required : true },
    stars : { type : Number, required : true },
    email : { type : String, required : true },
    createdAt : { type : Date, default : Date.now }
});

module.exports = model('feedbacks', mySchema);