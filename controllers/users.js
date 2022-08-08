const usersRouter = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

usersRouter.get('/', async (request,response) => {
    const users = await User.find({});
    response.status(200).json(users);
});

usersRouter.post('/', async (request,response) => {
    const { body } = request;

    if(!(body.username && body.password)){
        return response.status(404).send({error: 'the password and username is required'});
    }

    const userExistent = await User.findOne({username: body.username});
    if(userExistent){
        return response.status(400).json({error: 'the username is in use'});
    }

    if(body.username.length < 3 || body.password.length < 3){
        return response.status(400).json({error: 'username and password are too short: the minimum is 3 characters'});
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password,saltRounds);

    const newUser = new User({
        username: body.username,
        password: passwordHash
    });
    
    const result = await newUser.save();
    response.status(201).json(result);
});


module.exports = usersRouter;
