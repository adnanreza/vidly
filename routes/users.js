const express = require('express');
const mongoose = require('mongoose');
const { User, validateUser } = require('../models/User');
const router = express.Router();

/**
 * @route POST api/users/register
 * @desc Create new user
 * @access Public
 */
router.post('/', async (req, res) => {
    const validationResult = validateUser(req.body);
    if(validationResult.error){
        return res.status(400).send(validationResult.error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User email address already exists');
    
    user = new User({ 
        name: req.body.name, 
        email: req.body.email, 
        password: req.body.password 
    });
    user = await user.save();
    
    res.send(user);
})



module.exports = router;