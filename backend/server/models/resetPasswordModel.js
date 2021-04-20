const mongoose = require('mongoose');
Schema = mongoose.Schema;

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
});
module.exports = mongoose.model('PasswordResetToken', ResetTokenSchema);