const mongoose = require('mongoose');
const Joi = require('joi')

/**
 * Customer Schema and Model
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

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;