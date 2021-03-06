const mongoose = require('mongoose');
    Schema = mongoose.Schema;

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
});
Token = mongoose.model('Token', TokenSchema);

module.exports = Token;