const { Movie, validateMovie } = require('../models/Movie')
const { Genre } = require('../models/Genre')
const express = require('express');
const router = express.Router();


/**
 * @route GET api/movies
 * @desc Returns all movies
 * @access Public
 */
router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
})

/**
 * @route GET api/movies/:id
 * @desc Returns individual movie by id
 * @access Public
 */
router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('Movie with specified ID not found.');
    res.send(movie);   
}) 

/**
 * @route POST api/movies
 * @desc Create new movie
 * @access Public
 */
 router.post('/', async (req, res) => {
    const validationResult = validateMovie(req.body);
    if(validationResult.error){
        return res.status(400).send(validationResult.error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre');

    let movie = new Movie({ 
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock, 
        dailyRentalRate: req.body.dailyRentalRate, 
    });
    movie = await movie.save();
    
    res.send(movie);
})

/**
 * @route PUT api/movies/:id
 * @desc Update individual movie by id
 * @access Public
 */
 router.put('/:id', async (req, res) => {
    // Validate movie before update
    const validationResult = validateMovie(req.body);
    if(validationResult.error){
        return res.status(400).send(validationResult.error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre');

    const movie = await Movie.findByIdAndUpdate(req.params.id, 
        { 
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock, 
            dailyRentalRate: req.body.dailyRentalRate,  
        }, 
        { 
            new: true, 
            useFindAndModify: false 
        });
    
    if(!movie) return res.status(404).send('Movie with specified ID not found.');
    
    res.send(movie);
})

/**
 * @route DELETE api/movies/:id
 * @desc DELETE movie by id
 * @access Public
 */
 router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id, { useFindAndModify: false });
    if(!movie) return res.status(404).send('Movie with specified ID not found.');

    res.send(movie);   
}) 

module.exports = router;