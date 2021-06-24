const express = require('express');
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const { Genre, validateGenre } = require('../models/Genre');
const router = express.Router();

/**
 * @route GET api/genres
 * @desc Returns all genres
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find().sort('name');
        res.send(genres);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
    
})

/**
 * @route GET api/genres/:id
 * @desc Returns individual genre by id
 * @access Public
 */
router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('Genre with specified ID not found.');
    res.send(genre);   
}) 

/**
 * @route POST api/genres
 * @desc Create new genre
 * @access Private
 */
 router.post('/', auth, async (req, res) => {

    
    
    const validationResult = validateGenre(req.body);
    if(validationResult.error){
        return res.status(400).send(validationResult.error.details[0].message);
    }
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    
    res.send(genre);
})

/**
 * @route PUT api/genres/:id
 * @desc Update individual genre by id
 * @access Private
 */
 router.put('/:id', auth, async (req, res) => {
    // Validate genre before update
    const validationResult = validateGenre(req.body);
    if(validationResult.error){
        return res.status(400).send(validationResult.error.details[0].message);
    }

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true, useFindAndModify: false });
    
    if(!genre) return res.status(404).send('Genre with specified ID not found.');
    
    res.send(genre);
})

/**
 * @route DELETE api/genres/:id
 * @desc DELETE genre by id
 * @access Private
 */
 router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id, { useFindAndModify: false });
    if(!genre) return res.status(404).send('Genre with specified ID not found.');

    res.send(genre);   
}) 

module.exports = router;