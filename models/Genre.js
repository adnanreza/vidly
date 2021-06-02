const mongoose = require('mongoose');
const Joi = require('joi');

/**
 * Model and Schema for Genre
 */
 const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);

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

  exports.genreSchema = genreSchema;
  exports.Genre = Genre;
  exports.validateGenre = validateGenre;