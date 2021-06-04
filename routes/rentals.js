const { Rental, validateRental } = require('../models/Rental')
const { Movie } = require('../models/Movie');
const { Customer } = require('../models/Customer');
const auth = require('../middleware/auth')
const Fawn = require('fawn');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

/**
 * @route GET api/rentals
 * @desc Returns all rentals
 * @access Public
 */
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
})

/**
 * @route POST api/rentals
 * @desc Create new rental
 * @access Private
 */
 router.post('/', auth, async (req, res) => {
    const validationResult = validateRental(req.body);
    if(validationResult.error){
        return res.status(400).send(validationResult.error.details[0].message);
    }

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('No such Customer found');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('No such movie found');

    if(movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    let rental = new Rental({ 
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        }
    });

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();
    } catch (error) {
        res.status(500).send('Something failed')
    }   
    res.send(rental);
})

module.exports = router;