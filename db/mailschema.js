const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema for saving sender reciever and subject (plus time)
const mailSchema = new Schema({
    sender: {
        type: String,
        required: true
    },
    reciever: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Mail', mailSchema);