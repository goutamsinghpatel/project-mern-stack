const Joi = require('joi');

module.exports. listingSchema = Joi.object({
    Listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().allow("",null) ,
        country: Joi.string().required(),
    }).required()
});


module.exports.reviewSchema=Joi.object({
   review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
      
    }).required()
})


