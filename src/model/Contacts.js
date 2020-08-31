const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactSchema = new Schema({
    name: { type: String, required: true },
    lastname: { type: String },
    tel1: { type: String },
    tel2: { type: String },
    email: { type: String },
    img: { type: String },
    user: { type: String }
});

module.exports = mongoose.model('Contact', ContactSchema);