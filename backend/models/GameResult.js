const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    playerName: { type: String, required: true },
    score: { type: Number, required: true },
    timeSpent: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.GameResult || mongoose.model('GameResult', gameResultSchema);