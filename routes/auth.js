const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const { User, generateAuthToken } = require('../models/User');
const router = express.Router();

/**
 * @route POST api/auth
 * @desc Login user
 * @access Public
 */
router.post('/', async (req, res) => {
    const validationResult = validate(req.body);
    if(validationResult.error){
        return res.status(400).send(validationResult.error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email or password');
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');
    
    const token = user.generateAuthToken();

    res.send(token);
})

/**
 * @desc Validates req
 * @return valid or invalid
 */
 function validate(req) {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
    });
  
    return schema.validate(req);
  }



module.exports = router;