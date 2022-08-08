const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    score: {
        type: Number,
        required: true
    },
    date:{
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

scoreSchema.set('toJSON',{
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id;
        delete returnObject._id;
        delete returnObject.__v;
    }
});

module.exports = new mongoose.model('Score',scoreSchema);