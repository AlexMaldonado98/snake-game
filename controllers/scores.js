const scoresRouter = require('express').Router();
const Score = require('../models/Score');

scoresRouter.get('/', async (request,response) => {
    const scores = await Score.find({});
    response.status(200).json(scores);
});

scoresRouter.post('/',async (request,response,next) => {
    try {
        const { body } = request;

        const newScore = new Score({
            score: body.score,
            date: new Date()
        });

        const result = await newScore.save();
        response.status(201).json(result);

    } catch (error) {
        next(error);
    }
});

module.exports = scoresRouter;