// const { Schema, model } = require('../connection');
// // const bcrypt = require('bcryptjs');

// const userSchema = new Schema({

//     name:       { type: String, required: true },
//     contact:    { type: Number, required: true },
//     password:   { type: String, required: true },
//     email:      { type: String, required: true, unique: true },
//     username:   { type: String, unique: true, default: "" },
//     role:       { type: String, enum: ['user', 'admin'], default: 'user' },
//     profilePicture: {
//         type: String, // URL to profile picture
//         default: 'defaultProfilePic.jpg'
//     },
//     createdAt: { type: Date,default: Date.now }
// });

// module.exports = model('users', userSchema);



// // userSchema.pre('save', async function (next) {
// //     if (!this.isModified('password')) return next();

// //     const salt = await bcrypt.genSalt(10);
// //     this.passwordHash = await bcrypt.hash(this.password, salt);
// //     next();
// // });
// // Method to compare password with the hash in the database
// // userSchema.methods.comparePassword = async function (password) {
// //     return await bcrypt.compare(password, this.passwordHash);
// // };

const { Schema, model } = require('../connection');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name:       { type: String, required: true },
    contact:    { type: Number, required: true },
    password:   { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    username:   { type: String, unique: true, default: "" },
    role:       { type: String, enum: ['user', 'admin'], default: 'user' },
    profilePicture: {
        type: String, // URL to profile picture
        default: 'defaultProfilePic.jpg'
    },
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', function(next) {
    // Only hash the password if it's modified (or new)
    if (!this.isModified('password')) return next();

    // Generate salt
    bcrypt.genSalt(10)
        .then(salt => {
            // Hash the password with the salt
            return bcrypt.hash(this.password, salt);
        })
        .then(hashedPassword => {
            // Replace plain text password with hashed password
            this.password = hashedPassword;
            next();
        })
        .catch(error => {
            next(error);
        });
});

// Method to compare password with the hash in the database
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = model('users', userSchema);