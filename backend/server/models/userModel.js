const mongoose = require('mongoose'),
// const List = require('../models/listModel');
   Schema = mongoose.Schema,
    UserSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ['Male', 'Female']
        },
        dob: {
            type: Date
        },
        role: {
            type: String,
            default: 'basic',
            enum: ['basic', 'admin']
        },
        status: {
            type: String,
            default: 'enable',
            enum: ['enable', 'disable']
        },
        isVerified: { 
            type: Boolean, 
            default: false 
        },
        accessToken: {
            type: String
        },
        lists: [
            {
                type: Schema.Types.ObjectId, 
                ref: 'List' 
            }
        ]
    }),
    User = mongoose.model('User', UserSchema),

    // token schema
    TokenSchema = new Schema({
        _userId: { 
            type: Schema.Types.ObjectId, 
            required: true, 
            ref: 'User' 
        },
        token: { 
            type: String, 
            required: true 
        },
        createdAt: { 
            type: Date, 
            required: true, 
            default: Date.now, 
            expires: 43200 
        }
    }),
    Token = mongoose.model('Token', TokenSchema);

    const ResetTokenSchema = new Schema({
        _userId: {
            type: Schema.Types.ObjectId,
            required: true, 
            ref: 'User'
        },
        resettoken: {
            type: String, 
            required: true 
        },
        createdAt: {
            type: Date, 
            required: true, 
            default: Date.now, 
            expires: 43200 
        }
    }),
    PasswordResetToken = mongoose.model('PasswordResetToken', ResetTokenSchema);


module.exports = {
    User: User,
    Token: Token,
    PasswordResetToken
}

// module.exports = User;