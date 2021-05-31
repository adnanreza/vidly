const Joi = require('joi');
const express = require('express');
const app = express();

// Use middleware that allows parsing incoming reqs with JSON payloads
app.use(express.json());

const genres = [
    { id: 1, name: 'Thriller' },
    { id: 2, name: 'Comedy' },
    { id: 3, name: 'Drama' },
];

/**
 * @route GET api/genres
 * @desc Returns all genres
 * @access Public
 */

/**
 * @route GET api/genres
 * @desc Returns all genres
 * @access Public
 */

/**
 * @route GET api/genres
 * @desc Returns all genres
 * @access Public
 */

/**
 * @route DELETE api/genre/
 * @desc Returns all genres
 * @access Public
 */

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`Listening on port ${port}...`)})