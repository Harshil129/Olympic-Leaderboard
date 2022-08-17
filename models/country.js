//Naming convention > models are singular, router are plural
//Model is an object that represents my data and interacts with the DB

//Import mongoose
const mongoose = require('mongoose');

//Create a schema defination object 
const countrySchemaDefination = {
    countryName: {
        type: String,
        required: true
    },

    gold: {
        type: String,
        required: true
    },

    silver: {
        type: String,
        required: true
    },

    bronze: {
        type: String,
        required: true
    }, 

    eventName: {
        type: String,
        required: true
    },

    eventStatus: {
        type: String,
        default: 'On Going'
    }
};

//Create a new mongoose schema
const countrySchema = new mongoose.Schema(countrySchemaDefination);

//Create and import the mongoose model
module.exports = mongoose.model('Country', countrySchema);