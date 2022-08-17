const express = require('express');
const router = express.Router();
const Event = require('../models/event');

function IsLoggedIn(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

//GET handler for /Events/
router.get('/', IsLoggedIn, (req, res, next) => {
    Event.find((err, events) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('events/index', { 
                title: 'Event List', 
                dataset: events,
                user: req.user 
            });
        }
    });
});

//GET handler for /Events/Add 
router.get('/add', IsLoggedIn, (req, res, next) => {
    res.render('events/add', { 
        title: 'Add a new Event',
        user: req.user 
    });
});

//POST handler for /Events/Add
router.post('/add', IsLoggedIn, (req, res, next) => {
    Event.create({
        eventName: req.body.eventName
    }, (err, newEvent) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/events');
        }
    });
});

module.exports = router;