const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// Rota de Cadastro: POST /auth/register
router.post("/register", async (req, res) => {
    const { nome, email, senha } = req.body;
    const usersCollection = req.app.locals.usersCollection;

    try {
        const usuarioExistente = await usersCollection.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ mensagem: "Email já cadastrado." });
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        await usersCollection.insertOne({ nome, email, senha: senhaCriptografada });
        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso! Faça o login." });
    } catch (error) {
        res.status(500).json({ mensagem: "Erro no servidor ao cadastrar." });
    }
});

// Rota de Login: POST /auth/login
router.post("/login", async (req, res) => {
    const { email, senha } = req.body;
    const usersCollection = req.app.locals.usersCollection;
    
    try {
        const usuario = await usersCollection.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ mensagem: "Usuário não encontrado." });
        }
        const senhaConfere = await bcrypt.compare(senha, usuario.senha);
        if (!senhaConfere) {
            return res.status(401).json({ mensagem: "Senha incorreta." });
        }

        const token = jwt.sign(
            { id: usuario._id, nome: usuario.nome },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            mensagem: "Login bem-sucedido!",
            token: token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    } catch (error) {
        res.status(500).json({ mensagem: "Erro no servidor ao fazer login." });
    }
});

module.exports = router;
