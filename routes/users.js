const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const { User, validateUser, generateAuthToken } = require('../models/User');
const router = express.Router();

/**
 * @route POST api/users
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
    
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)
    user = await user.save();
    
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id','name', 'email']));
})



module.exports = router;