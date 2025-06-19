const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    gameType: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Game || mongoose.model('Game', gameSchema);