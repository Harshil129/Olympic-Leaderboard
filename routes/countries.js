// import express
const express = require('express');
//create router object
const router = express.Router();
//import mongoose model
const Country = require('../models/country');
const Event = require('../models/event');

function IsLoggedIn(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

//configure routes
//GET handler /Countries/
router.get('/', (req, res, next) => {
    // res.render('countries/index', {
    // title: "Welcome to Olympic Leaderboard"
    // });
    
    Country.find((err, countries) => {
        if (err) { console.log(err); }
        else 
        {
            res.render('countries/index',
        {
            title: "Welcome to Olympic Leaderboard",
            dataset: countries,
            user: req.user
        });
       }
    });
});

//Adding a country
//GET handler /Countries/Add
router.get('/add', IsLoggedIn, (req, res, next) => {
    // res.render('countries/add', {
    //     title: 'Add a new country'
    // });
    Event.find((err, events) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('countries/add', { 
                title: 'Add a New Country', 
                events: events,
                user: req.user 
            });
        }
    }).sort({ name: -1 });
});


// Add POST handler
router.post('/add', IsLoggedIn, (req, res, next) => {
    // use the project module to save data to DB
    // call create method of the model 
    // and map the fields with data from the request
    // callback function will return an error if any or a newProject object
    Country.create({
        countryName: req.body.countryName,
        gold: req.body.gold,
        silver: req.body.silver,
        bronze: req.body.bronze,
        eventName: req.body.eventName
    }, (err, newCountry) => {
        if (err) {
            console.log(err);
        }
        else {
            // We can show a successful message by redirecting them to index
            res.redirect('/countries');
        }
    });
});

// GET handler for Delete operations
// :_id is a placeholder for naming whatever is after the / in the path
router.get('/delete/:_id', IsLoggedIn, (req, res, next) => {
    // call remove method and pass id as a json object
    Country.remove({ _id: req.params._id }, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/countries')
        }
    })
});

// GET handler for Edit operations
router.get('/edit/:_id', IsLoggedIn, (req, res, next) => {
    // Find the Project by ID
    // Find available courses
    // Pass them to the view
    Country.findById(req.params._id, (err, country) => {
        if (err) {
            console.log(err);
        }
        else {
            Event.find((err, events) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render('countries/edit', {
                        title: 'Edit a Country',
                        country: country,
                        events: events,
                        user: req.user
                    });
                }
            }).sort({ name: 1 });
        }
    });
});

// POST handler for Edit operations
router.post('/edit/:_id', IsLoggedIn, (req,res,next) => {
    // find project based on ID
    // try updating with form values
    // redirect to /Projects
    Country.findOneAndUpdate({_id: req.params._id}, {
        countryName: req.body.countryName,
        gold: req.body.gold,
        silver: req.body.silver,
        bronze: req.body.bronze,
        eventName: req.body.eventName,
        eventStatus: req.body.eventStatus
    }, (err, updatedCountry) => {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect('/countries');
        }
    });
});

//export router object
module.exports = router;