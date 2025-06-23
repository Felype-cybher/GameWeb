const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const { ObjectId } = require('mongodb');

// ROTA PARA BUSCAR TODOS OS JOGOS
router.get('/', async (req, res) => {
    const gamesCollection = req.app.locals.gamesCollection;
    try {
        const games = await gamesCollection.find().sort({ createdAt: -1 }).toArray();
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar os jogos." });
    }
});

// ROTA PARA CRIAR UM NOVO JOGO
router.post('/', async (req, res) => {
    const gamesCollection = req.app.locals.gamesCollection;
    const { title, description, gameType, data, createdBy } = req.body;
    const gameDocument = { title, description, gameType, data, createdBy, createdAt: new Date() };

    try {
        const result = await gamesCollection.insertOne(gameDocument);
        const newGame = { ...gameDocument, _id: result.insertedId };
        res.status(201).json(newGame);
    } catch (err) {
        res.status(400).json({ message: "Erro ao salvar o jogo no banco de dados." });
    }
});

// ROTA PARA SALVAR O RESULTADO DE UMA PARTIDA
router.post('/:gameId/results', async (req, res) => {
    const { gameId } = req.params;
    const { playerName, score, timeSpent, correctAnswers, totalQuestions } = req.body;
    const resultsCollection = req.app.locals.resultsCollection;

    const newResult = {
        gameId: new ObjectId(gameId),
        playerName,
        score,
        timeSpent,
        correctAnswers,
        totalQuestions,
        completedAt: new Date()
    };

    try {
        await resultsCollection.insertOne(newResult);
        res.status(201).json({ message: 'Resultado salvo com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao salvar o resultado.' });
    }
});

module.exports = router;
