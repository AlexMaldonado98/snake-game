const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
    username: String,
    password: String,
    scoresUser:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Score'
        }
    ]
});

userShema.set('toJSON',{
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id;
        delete returnObject._id;
        delete returnObject.__v;
        delete returnObject.password;
    }
});

module.exports = new mongoose.model('User',userShema);