const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
if (!uri) {
    console.error("❌ Erro: A variável MONGO_URI não está definida no arquivo .env");
    process.exit(1);
}
const client = new MongoClient(uri);

async function startServer() {
    try {
        await client.connect();
        const db = client.db("meuBanco");
        console.log("✅ Conectado ao MongoDB com sucesso!");

        app.locals.usersCollection = db.collection("usuarios");
        app.locals.gamesCollection = db.collection("games");
        app.locals.resultsCollection = db.collection("results");

        // --- Configuração das Rotas ---
        const authRoutes = require('./routes/auth');
        const gameRoutes = require('./routes/games');
        const resultRoutes = require('./routes/results'); // Caminho corrigido

        app.use('/auth', authRoutes);
        app.use('/api/games', gameRoutes); // Linha duplicada removida
        app.use('/api/results', resultRoutes);

        app.listen(port, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${port}`);
        });

    } catch (e) {
        console.error("❌ Falha fatal ao iniciar o servidor", e);
        await client.close();
        process.exit(1);
    }
}

startServer();
