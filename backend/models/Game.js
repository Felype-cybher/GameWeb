const mongoose = require('mongoose');


const termDefinitionSchema = new mongoose.Schema({ term: String, definition: String }, {_id: false});
const wordHintSchema = new mongoose.Schema({ word: String, hint: String }, {_id: false});
const itemCategorySchema = new mongoose.Schema({
    items: [{ name: String, category: String }],
    categories: [String],
}, {_id: false});

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  gameType: { type: String, required: true },
  data: {
    termsAndDefinitions: [termDefinitionSchema],
    wordList: [wordHintSchema],
    itemsAndCategories: itemCategorySchema
  },
  createdBy: { type: String, required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});


GameSchema.pre('save', function(next) {
  if (this.gameType !== 'hangman') {
    this.data.wordList = undefined;
  }
  if (this.gameType !== 'dragdrop') {
    this.data.itemsAndCategories = undefined;
  }
  if (this.gameType !== 'memory' && this.gameType !== 'quiz' && this.gameType !== 'association') {
      this.data.termsAndDefinitions = undefined;
  }
  next();
});

module.exports = mongoose.models.Game || mongoose.model('Game', GameSchema);