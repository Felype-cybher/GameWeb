const express = require('express');
const router = express.Router();

// ROTA PARA BUSCAR TODOS OS RESULTADOS COM DADOS DO JOGO EMBUTIDOS
router.get('/', async (req, res) => {
    const resultsCollection = req.app.locals.resultsCollection;
    try {
        const results = await resultsCollection.aggregate([
            {
                // Junta a coleção 'results' com a coleção 'games'
                $lookup: {
                    from: 'games', // A outra coleção
                    localField: 'gameId', // O campo em 'results'
                    foreignField: '_id', // O campo em 'games' que corresponde
                    as: 'gameDetails' // O nome do novo array que será criado com os detalhes do jogo
                }
            },
            {
                // Ordena os resultados pela data em que foram completados, do mais novo para o mais antigo
                $sort: { completedAt: -1 }
            },
            {
                // Desconstrói o array 'gameDetails' para que seja um objeto único
                $unwind: '$gameDetails'
            }
        ]).toArray();
        
        res.json(results);
    } catch (err) {
        console.error("Erro ao buscar resultados enriquecidos:", err);
        res.status(500).json({ message: "Erro ao buscar os resultados." });
    }
});

module.exports = router;
