const scoresRouter = require('express').Router();
const Score = require('../models/Score');
const middleware = require('../utils/middleware');

scoresRouter.get('/', async (request, response) => {
    const scores = await Score.find({}).populate('user',{username: 1});
    response.status(200).json(scores);
});


scoresRouter.post('/',middleware.userExtractor,async (request, response, next) => {
    try {
        const { body } = request;
        const user = request.user;
        console.log(request.user);

        const newScore = new Score({
            score: body.score,
            date: new Date().toLocaleString(),
            user: user._id
        });

        const result = await newScore.save();
        user.scoresUser = user.scoresUser.concat(result._id);
        await user.save();

        response.status(201).json(result);

    } catch (error) {
        next(error);
    }
});

scoresRouter.put('/:id',async (request,response,next) => {
    try {
        const id = request.params.id;
        const { body } = request;
        const result = await Score.findByIdAndUpdate(id,body,{new:true});
        response.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

scoresRouter.delete('/:id',middleware.userExtractor,async (request,response,next) => {
    try {
        const id = request.params.id;
        const user = request.user;
        const scoreToDelete = await Score.findById(id);
        if(scoreToDelete.user.toString() === user._id.toString()){
            await Score.deleteOne({_id:id});
            response.status(200).end();
        }else{
            response.status(401).json({error: 'unauthorized operation'});
        }
    } catch (error) {
        next(error);
    }
});

module.exports = scoresRouter;