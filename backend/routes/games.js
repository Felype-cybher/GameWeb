const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const verificarToken = require('../verificarToken');

router.get('/', async (req, res) => {
    const gamesCollection = req.app.locals.gamesCollection;
    try {
        const query = {
            $or: [
                { isPublic: true },
                { isPublic: { $exists: false } }
            ]
        };
        const games = await gamesCollection.find(query).sort({ createdAt: -1 }).toArray();
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar os jogos." });
    }
});

router.get('/my-games', verificarToken, async (req, res) => {
    const gamesCollection = req.app.locals.gamesCollection;
    try {
        const userGames = await gamesCollection.find({ creatorId: new ObjectId(req.user.id) }).sort({ createdAt: -1 }).toArray();
        res.json(userGames);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar os jogos do usuário." });
    }
});

router.post('/', verificarToken, async (req, res) => {
    const gamesCollection = req.app.locals.gamesCollection;
    // MODIFICAÇÃO AQUI: Adicionamos 'description'
    const { title, description, gameType, data, createdBy, isPublic } = req.body;

    const gameDocument = {
        title,
        description, // <-- Adicionado
        gameType,
        data,
        createdBy,
        isPublic,
        creatorId: new ObjectId(req.user.id),
        createdAt: new Date()
    };

    try {
        const result = await gamesCollection.insertOne(gameDocument);
        const newGame = { ...gameDocument, _id: result.insertedId };
        res.status(201).json(newGame);
    } catch (err) {
        res.status(400).json({ message: "Erro ao salvar o jogo no banco de dados." });
    }
});

router.get('/:id', async (req, res) => {
    const gamesCollection = req.app.locals.gamesCollection;
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID do jogo inválido.' });
        }
        const game = await gamesCollection.findOne({ _id: new ObjectId(id) });
        if (!game) {
            return res.status(404).json({ message: 'Jogo não encontrado.' });
        }
        res.json(game);
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor ao buscar o jogo.' });
    }
});

router.post('/:gameId/results', verificarToken, async (req, res) => {
    const { gameId } = req.params;
    const { score, timeSpent, correctAnswers, totalQuestions } = req.body;
    const resultsCollection = req.app.locals.resultsCollection;
    const usersCollection = req.app.locals.usersCollection;
    
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });

    const newResult = {
        gameId: new ObjectId(gameId),
        playerName: user.nome,
        playerId: new ObjectId(req.user.id),
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