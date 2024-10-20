const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    financialDocuments: [{ type: String }], // Store paths to uploaded docs
    goals: { type: String },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
