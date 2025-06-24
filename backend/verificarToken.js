const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Pega o token do cabeçalho 'Authorization' da requisição
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        // O token geralmente vem no formato "Bearer TOKEN_AQUI"
        // Nós pegamos apenas a parte do token
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Formato de token inválido.' });
        }

        // Verifica se o token é válido usando o nosso segredo
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Adiciona os dados do usuário (que estavam no token) ao objeto da requisição
        // Agora, qualquer rota protegida saberá qual usuário está fazendo a requisição
        req.user = decoded; 
        
        // Continua para a próxima etapa (a rota de fato)
        next(); 
    } catch (ex) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};
