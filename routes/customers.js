const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

/**
 * Schema for Customer
 */
const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false, 
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Customer = mongoose.model('Customer', customerSchema);

/**
 * @route GET api/customers
 * @desc Returns all customers
 * @access Public
 */
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
})

/**
 * @route GET api/customers/:id
 * @desc Returns individual customer by id
 * @access Public
 */
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send('Customer with specified ID not found.');
    res.send(customer);   
}) 

/**
 * @route POST api/customers
 * @desc Create new customer
 * @access Public
 */
 router.post('/', async (req, res) => {
    const validationResult = validateCustomer(req.body);
    if(validationResult.error){
        return res.status(400).send(validationResult.error.details[0].message);
    }
    let customer = new Customer({ 
        isGold: req.body.isGold,
        name: req.body.name, 
        phone: req.body.phone, 
    });
    customer = await customer.save();
    
    res.send(customer);
})

/**
 * @route PUT api/customers/:id
 * @desc Update individual customer by id
 * @access Public
 */
 router.put('/:id', async (req, res) => {
    // Validate customer before update
    const validationResult = validateCustomer(req.body);
    if(validationResult.error){
        return res.status(400).send(validationResult.error.details[0].message);
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, 
        { 
            isGold: req.body.isGold,
            name: req.body.name, 
            phone: req.body.phone,  
        }, 
        { 
            new: true, 
            useFindAndModify: false 
        });
    
    if(!customer) return res.status(404).send('customer with specified ID not found.');
    
    res.send(customer);
})

/**
 * @route DELETE api/customers/:id
 * @desc DELETE customer by id
 * @access Public
 */
 router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id, { useFindAndModify: false });
    if(!customer) return res.status(404).send('Customer with specified ID not found.');

    res.send(customer);   
}) 

/**
 * @desc Validates customer using Joi
 * @return valid or invalid field
 */
 function validateCustomer(customer) {
    const schema = Joi.object({
      isGold: Joi.boolean(),
      name: Joi.string().min(5).max(50).required(),
      phone: Joi.string().min(5).max(50).required(),
    });
  
    return schema.validate(customer);
  }

module.exports = router;