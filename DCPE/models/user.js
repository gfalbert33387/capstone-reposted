const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Define the schema for the user
const userSchema = new Schema({
    // First name field with validation
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    // Last name field with validation
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    // Email field with validation and uniqueness
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: [true, 'This email address has been used']
    },
    // Password field with validation
    password: {
        type: String,
        required: [true, 'Password is required']
    }
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', function(next) {
    let user = this;
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // Hash the password with a salt round of 10
    bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
            next();
        })
        .catch(err => next(err));
});

// Method to compare a given password with the hashed password
userSchema.methods.comparePassword = function(inputPassword) {
    let user = this;
    return bcrypt.compare(inputPassword, user.password);
}

// Export the model, 'User', with the defined schema
module.exports = mongoose.model('User', userSchema);