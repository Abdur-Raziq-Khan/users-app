const mongoose = require('mongoose');
// const User = require('../models/userModel');
    Schema = mongoose.Schema;
    ListSchema = new Schema({
        content: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    });
    List = mongoose.model('list', ListSchema);

module.exports = List;