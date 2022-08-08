const loginRouter = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../utils/config'); 

loginRouter.post('/', async (request,response,next) => {
    try {
        const {username, password} = request.body;
        const user = await User.findOne({username: username});
        const passIsCorrect = user !== null ? await bcrypt.compare(password,user.password) : false;

        if(!(user && passIsCorrect)){
            return response.status(400).json({error: 'the username or password is incorrect.'});
        }

        const tokenInfo = {
            id: user._id,
            username: user.username
        };

        const token = await jwt.sign(tokenInfo,config.SECRET,{expiresIn: 60 * 60 * 24});

        response.status(200).send({token,username:user.username});

    } catch (error) {
        next(error);
    }
});

module.exports = loginRouter;