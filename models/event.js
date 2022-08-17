const mongoose = require('mongoose');

const schemaDefination = {
    eventName: {
        type: String,
        required: true
    }
};

const eventsSchema = new mongoose.Schema(schemaDefination);
module.exports = mongoose.model('Event', eventsSchema);