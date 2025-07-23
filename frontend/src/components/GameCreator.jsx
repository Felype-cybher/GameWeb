import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import WordListForm from './gamecreator/WordListForm'; // Formulário da Forca
import ItemsCategoriesForm from './gamecreator/ItemsCategoriesForm'; // Formulário do Arrastar e Soltar
import TermsDefinitionsForm from './gamecreator/TermsDefinitionsForm'; // Formulário Padrão

const GameCreator = ({ onCreateGame, onCancel, gameToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gameType, setGameType] = useState('memory');
  const [isPublic, setIsPublic] = useState(true);

  // Estados para cada tipo de dados de jogo
  const [pairs, setPairs] = useState([{ term: '', definition: '' }]);
  const [wordList, setWordList] = useState([{ word: '', hint: '' }]);
  const [itemsAndCategories, setItemsAndCategories] = useState({
    items: [{ name: '', category: '' }],
    categories: ['', ''],
  });

  useEffect(() => {
    if (gameToEdit) {
      setTitle(gameToEdit.title || '');
      setDescription(gameToEdit.description || '');
      setGameType(gameToEdit.gameType || 'memory');
      setIsPublic(gameToEdit.isPublic ?? true);

      // Carrega os dados corretos dependendo do tipo de jogo a ser editado
      if (gameToEdit.gameType === 'hangman') {
        setWordList(gameToEdit.data?.wordList || [{ word: '', hint: '' }]);
      } else if (gameToEdit.gameType === 'dragdrop') {
        setItemsAndCategories(gameToEdit.data?.itemsAndCategories || { items: [{ name: '', category: '' }], categories: ['', ''] });
      } else {
        setPairs(gameToEdit.data?.termsAndDefinitions || [{ term: '', definition: '' }]);
      }
    }
  }, [gameToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let gameDataPayload = {};
    if (gameType === 'hangman') {
      if (!title || !description || wordList.some(item => !item.word || !item.hint)) {
        alert('Por favor, preencha todos os campos, incluindo palavras e dicas.');
        return;
      }
      gameDataPayload = { wordList };
    } else if (gameType === 'dragdrop') {
        if (!title || !description || itemsAndCategories.items.some(i => !i.name || !i.category) || itemsAndCategories.categories.some(c => !c)) {
            alert('Por favor, preencha todos os campos, incluindo nomes de itens e categorias.');
            return;
        }
        gameDataPayload = { itemsAndCategories };
    } else {
      if (!title || !description || pairs.some(p => !p.term || !p.definition)) {
        alert('Por favor, preencha todos os campos de termos e definições.');
        return;
      }
      gameDataPayload = { termsAndDefinitions: pairs };
    }

    const gameData = { title, description, gameType, isPublic, data: gameDataPayload, id: gameToEdit?._id };
    onCreateGame(gameData);
  };

  const renderGameSpecificForm = () => {
    switch (gameType) {
      case 'hangman':
        return <WordListForm wordList={wordList} setWordList={setWordList} />;
      case 'dragdrop':
        return <ItemsCategoriesForm itemsAndCategories={itemsAndCategories} setItemsAndCategories={setItemsAndCategories} />;
      default:
        return <TermsDefinitionsForm termsAndDefinitions={pairs} setTermsAndDefinitions={setPairs} />;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{gameToEdit ? 'Editar Jogo' : 'Criar Novo Jogo'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título do Jogo</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Capitais do Mundo" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Teste seus conhecimentos de geografia" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gameType">Tipo de Jogo</Label>
          <Select value={gameType} onValueChange={setGameType} disabled={!!gameToEdit}>
            <SelectTrigger id="gameType"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="memory">Jogo da Memória</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="association">Associação</SelectItem>
              <SelectItem value="hangman">Jogo da Forca</SelectItem>
              <SelectItem value="dragdrop">Arrastar e Soltar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {renderGameSpecificForm()}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <Label htmlFor="is-public" className="text-sm font-medium text-blue-800">
            Jogo Público?
            <p className="text-xs text-blue-600">Públicos aparecem para todos. Privados só para você.</p>
          </Label>
          <Switch id="is-public" checked={isPublic} onCheckedChange={setIsPublic} />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">{gameToEdit ? 'Salvar Alterações' : 'Criar Jogo'}</Button>
        </div>
      </form>
    </div>
  );
};

export default GameCreator;