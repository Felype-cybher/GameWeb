const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require('dotenv').config();

const app = express();
const port = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// --- Conexão com o Banco de Dados e Inicialização do Servidor ---
const uri = process.env.MONGO_URI;
if (!uri) {
    console.error("❌ Erro: A variável MONGO_URI não está definida no arquivo .env");
    process.exit(1);
}
const client = new MongoClient(uri);

async function startServer() {
    try {
        // 1. Conecta ao banco de dados
        await client.connect();
        const db = client.db("meuBanco");
        console.log("✅ Conectado ao MongoDB com sucesso!");

        // 2. Disponibiliza as coleções para todas as rotas da aplicação
        app.locals.usersCollection = db.collection("usuarios");
        app.locals.gamesCollection = db.collection("games");
        app.locals.resultsCollection = db.collection("results");

        // 3. Configura as rotas DEPOIS que a conexão está estabelecida
        const authRoutes = require('./routes/auth');
        const gameRoutes = require('./routes/games');

        app.use('/auth', authRoutes); // Rotas de autenticação (ex: /auth/login)
        app.use('/api/games', gameRoutes); // Rotas de jogos

        // 4. Inicia o servidor para ouvir as requisições
        app.listen(port, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${port}`);
        });

    } catch (e) {
        console.error("❌ Falha fatal ao conectar ao MongoDB ou iniciar o servidor.", e);
        await client.close(); // Garante que a conexão seja fechada em caso de erro
        process.exit(1);
    }
}

// Inicia todo o processo
startServer();
