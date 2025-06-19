const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3001; // porta do backend

app.use(cors()); // libera requisições do frontend
app.use(express.json());

// DENTRO DE backend/server.js

app.use(express.json());

// ADICIONE ESTAS DUAS LINHAS AQUI:
const gameRoutes = require('./routes/games');
app.use('/api/games', gameRoutes);

// O resto do seu código de login/cadastro continua abaixo...

const uri = "mongodb+srv://Felype:4vGlzhWyQtIZgpRP@users.hbssqfi.mongodb.net/?retryWrites=true&w=majority&appName=Users";
const client = new MongoClient(uri);
let usersCollection;

client.connect().then(() => {
    const db = client.db("meuBanco");
    usersCollection = db.collection("usuarios");
    console.log("✅ Conectado ao MongoDB e pronto para cadastrar/logar usuários");
});

// Rota de cadastro
app.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body;

    const usuarioExistente = await usersCollection.findOne({ email });
    if (usuarioExistente) {
        return res.status(400).json({ mensagem: "Email já cadastrado." });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    await usersCollection.insertOne({ nome, email, senha: senhaCriptografada });

    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
});

// Rota de login
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    const usuario = await usersCollection.findOne({ email });
    if (!usuario) {
        return res.status(400).json({ mensagem: "Usuário não encontrado." });
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha);
    if (!senhaConfere) {
        return res.status(401).json({ mensagem: "Senha incorreta." });
    }

    res.status(200).json({ mensagem: "Login bem-sucedido!" });
});

app.get("/", (req, res) => {
    res.send("Bem-vindo à API de Cadastro e Login!");
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
