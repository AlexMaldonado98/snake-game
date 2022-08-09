const logger = require('./logger');
const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('../models/User');


const unknownEndPoint = (request,response) => {
    response.status(404).send({error: 'unknown endpoint'});
};

const errorHandler = (error,request,response,next) => {
    logger.info(error.name);
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'});
    }else if (error.name === 'ValidationError'){
        return response.status(400).json({error: error.message});
    }

    next(error);
};

const tokenExtractor = async (request,response,next) => {
    const tokenFormat = request.get('Authorization');
    if(tokenFormat && tokenFormat.toLowerCase().startsWith('beare')){
        request.token = tokenFormat.split(' ')[1];
    }
    next();
};

const userExtractor = async (request,response,next) => {
    const decryptedToken = jwt.verify(request.token,config.SECRET);
    if(!(decryptedToken && decryptedToken.id)){
        return response.status(400).json({error: 'token is invalid or is missing'});
    }
    request.user = await User.findById(decryptedToken.id);
    next();
};

module.exports = {
    tokenExtractor,
    userExtractor,
    unknownEndPoint,
    errorHandler
};