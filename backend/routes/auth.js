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

// ... suas rotas de register e login existentes ...

const authMiddleware = require('../verificarToken'); // Importa o nosso verificador
const { ObjectId } = require('mongodb'); // Importante para buscar pelo ID

// ROTA PARA MUDAR A SENHA (POST /auth/change-password)
// Note que passamos `authMiddleware` antes da lógica da rota. Isso a protege.
router.post('/change-password', authMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const usersCollection = req.app.locals.usersCollection;
    const userId = req.user.id; // Pegamos o ID do usuário que o middleware decodificou do token

    try {
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Verifica se a senha antiga fornecida está correta
        const isMatch = await bcrypt.compare(oldPassword, user.senha);
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha antiga incorreta.' });
        }

        // Criptografa a nova senha e atualiza no banco de dados
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { senha: hashedNewPassword } }
        );

        res.json({ message: 'Senha alterada com sucesso!' });

    } catch (error) {
        console.error("Erro ao alterar senha:", error);
        res.status(500).json({ message: 'Erro no servidor ao alterar a senha.' });
    }
});


module.exports = router;

