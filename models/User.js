const mongoose = require('mongoose');
const Joi = require('joi')
const jwt = require('jsonwebtoken')


/**
 * User Schema and Model
 */
 const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function() {
   const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.jwtPrivateKey);
   return token;
}

const User = mongoose.model('User', userSchema);

/**
 * @desc Validates User using Joi
 * @return valid or invalid field
 */
 function validateUser(user) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
    });
  
    return schema.validate(user);
  }

exports.User = User;
exports.validateUser = validateUser;