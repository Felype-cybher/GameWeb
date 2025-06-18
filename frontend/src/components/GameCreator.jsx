import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Brain,
  Target,
  Shuffle
} from 'lucide-react';
import GameTypeSelector from '@/components/gamecreator/GameTypeSelector';
import BasicInfoForm from '@/components/gamecreator/BasicInfoForm';
import TermsDefinitionsForm from '@/components/gamecreator/TermsDefinitionsForm';
import ItemsCategoriesForm from '@/components/gamecreator/ItemsCategoriesForm';

const GameCreator = ({ onCreateGame, onCancel }) => {
  const [gameType, setGameType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [termsAndDefinitions, setTermsAndDefinitions] = useState([
    { term: '', definition: '' }
  ]);
  const [itemsAndCategories, setItemsAndCategories] = useState({
    categories: [''],
    items: [{ name: '', category: '' }]
  });
  const { toast } = useToast();

  const gameTypeDetails = {
    memory: { name: 'Jogo da Memória', description: 'Encontre pares', icon: Brain, color: 'bg-blue-500' },
    quiz: { name: 'Quiz', description: 'Escolha a definição', icon: Target, color: 'bg-green-500' },
    dragdrop: { name: 'Arrastar e Soltar', description: 'Agrupe itens', icon: Shuffle, color: 'bg-red-500' }
  };

  const validateGame = () => {
    if (!gameType || !title.trim() || !description.trim()) {
      toast({ title: "Erro", description: "Preencha tipo, título e descrição." });
      return false;
    }
    if ((gameType === 'memory' || gameType === 'quiz') && termsAndDefinitions.filter(p => p.term.trim() && p.definition.trim()).length < 2) {
      toast({ title: "Erro", description: "Adicione pelo menos 2 pares de termo/definição." });
      return false;
    }
    if (gameType === 'dragdrop') {
      if (itemsAndCategories.categories.filter(c => c.trim()).length < 2) {
        toast({ title: "Erro", description: "Adicione pelo menos 2 categorias." });
        return false;
      }
      if (itemsAndCategories.items.filter(i => i.name.trim() && i.category.trim()).length < 2) {
        toast({ title: "Erro", description: "Adicione pelo menos 2 itens com categorias." });
        return false;
      }
    }
    return true;
  };

  const handleCreateGame = () => {
    if (!validateGame()) return;
    const gameData = { type: gameType, title: title.trim(), description: description.trim() };
    if (gameType === 'memory' || gameType === 'quiz') {
      gameData.termsAndDefinitions = termsAndDefinitions.filter(p => p.term.trim() && p.definition.trim());
    }
    if (gameType === 'dragdrop') {
      gameData.itemsAndCategories = {
        categories: itemsAndCategories.categories.filter(c => c.trim()),
        items: itemsAndCategories.items.filter(i => i.name.trim() && i.category.trim())
      };
    }
    onCreateGame(gameData);
  };

  if (!gameType) {
    return (
      <GameTypeSelector 
        onSelectType={setGameType} 
        onCancel={onCancel} 
        gameTypeDetails={gameTypeDetails} 
      />
    );
  }

  const selectedTypeInfo = gameTypeDetails[gameType];

  return (
    <div className="bg-white rounded-lg p-6 shadow space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center space-x-3">
          <div className={`${selectedTypeInfo.color} p-2 rounded-md`}>
            <selectedTypeInfo.icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Criar {selectedTypeInfo.name}
            </h2>
            <p className="text-sm text-gray-500">
              {selectedTypeInfo.description}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setGameType('')}
          variant="ghost"
          className="text-gray-600 hover:bg-gray-100 text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Mudar Tipo
        </Button>
      </div>

      <BasicInfoForm
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />

      {(gameType === 'memory' || gameType === 'quiz') && (
        <TermsDefinitionsForm
          termsAndDefinitions={termsAndDefinitions}
          setTermsAndDefinitions={setTermsAndDefinitions}
        />
      )}

      {gameType === 'dragdrop' && (
        <ItemsCategoriesForm
          itemsAndCategories={itemsAndCategories}
          setItemsAndCategories={setItemsAndCategories}
        />
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          onClick={onCancel}
          variant="outline"
          className="text-sm"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleCreateGame}
          className="bg-green-500 hover:bg-green-600 text-white text-sm"
        >
          <Save className="h-4 w-4 mr-1" />
          Criar Jogo
        </Button>
      </div>
    </div>
  );
};

export default GameCreator;