// backend/routes/games.js
const express = require('express');
const router = express.Router();
const Game = require('../models/Game'); // Importa o nosso modelo de Jogo

// ROTA PARA BUSCAR TODOS OS JOGOS (GET /api/games)
router.get('/', async (req, res) => {
    try {
        // Busca todos os jogos no banco de dados, ordenando pelos mais recentes
        const games = await Game.find().sort({ createdAt: -1 }); 
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar os jogos." });
    }
});

// ROTA PARA CRIAR UM NOVO JOGO (POST /api/games)
router.post('/', async (req, res) => {
    // Pega os dados do corpo da requisição enviada pelo frontend
    const { title, description, gameType, data, createdBy } = req.body;

    const game = new Game({
        title,
        description,
        gameType,
        data,
        createdBy
    });

    try {
        const newGame = await game.save(); // Salva o novo jogo no banco
        res.status(201).json(newGame); // Retorna o jogo criado com sucesso
    } catch (err) {
        res.status(400).json({ message: "Erro ao criar o jogo." });
    }
});

module.exports = router;