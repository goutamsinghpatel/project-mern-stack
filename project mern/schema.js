const Joi = require('joi');

const listingSchema = Joi.object({
    Listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().allow("",null) ,
        country: Joi.string().required(),
    }).required()
});

module.exports = { listingSchema };