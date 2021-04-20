const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schemas = {

    signUp: Joi.object().keys({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).regex(/^[a-zA-Z0-9]{3,30}$/).alphanum().required(),
        phone: Joi.string(),
        gender: Joi.string(),
        dob: Joi.date(),
        role: Joi.string(),
        status: Joi.string()
    }),

    signIn: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).regex(/^[a-zA-Z0-9]{3,30}$/).alphanum().required()
    }),

    updateUser: Joi.object().keys({
        userId: Joi.objectId().required(),
        name: Joi.string().allow('').min(3),
        phone: Joi.string(),
        gender: Joi.string(),
        dob: Joi.date(),
        role: Joi.string().allow(''),
        status: Joi.string()
    }),

    userId: Joi.object().keys({
        userId: Joi.objectId().required(),
    })
};

exports.schemas = schemas;