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
app.get('/api/genres', (req, res) => {
    res.send(genres);
})

/**
 * @route GET api/genres/:id
 * @desc Returns individual genre by id
 * @access Public
 */
app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => parseInt(req.params.id) === g.id);
    if(!genre) return res.status(404).send('Genre with specified ID not found.');
    res.send(genre);   
}) 

/**
 * @route POST api/genres
 * @desc Create new genre
 * @access Public
 */
 app.post('/api/genres', (req, res) => {
    const validationResult = validateGenre(req.body);
    if(validationResult.error){
        return res.status(404).send(validationResult.error.details[0].message);
    }
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }
    genres.push(genre);
    res.send(genre);
}) 

/**
 * @route PUT api/genres/:id
 * @desc Update individual genre by id
 * @access Public
 */
 app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => parseInt(req.params.id) === g.id);
    if(!genre) return res.status(404).send('Genre with specified ID not found.');

    const validationResult = validateGenre(req.body);
    if(validationResult.error){
        return res.status(404).send(validationResult.error.details[0].message);
    }
    console.log(req.body)
    genre.name = req.body.name;
    res.send(genre);
})

/**
 * @route DELETE api/genres/:id
 * @desc DELETE genre by id
 * @access Public
 */
 app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => parseInt(req.params.id) === g.id);
    if(!genre) return res.status(404).send('Genre with specified ID not found.');
    
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);   
}) 

/**
 * @desc Validates genre using Joi
 * @return valid or invalid field
 */
 function validateGenre(genre) {
    const schema = Joi.object({
      name: Joi.string().min(3).required()
    });
  
    return schema.validate(genre);
  }

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`Listening on port ${port}...`)})