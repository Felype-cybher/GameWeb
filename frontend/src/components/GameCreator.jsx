import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Save, 
  ArrowLeft,
  Brain,
  Target,
  Shuffle,
  Lightbulb // <-- 1. Importe o novo ícone
} from 'lucide-react';
import GameTypeSelector from '@/components/gamecreator/GameTypeSelector';
import BasicInfoForm from '@/components/gamecreator/BasicInfoForm';
import TermsDefinitionsForm from '@/components/gamecreator/TermsDefinitionsForm';
import ItemsCategoriesForm from '@/components/gamecreator/ItemsCategoriesForm';

const GameCreator = ({ onCreateGame, onCancel }) => {
  const [gameType, setGameType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [termsAndDefinitions, setTermsAndDefinitions] = useState([ { term: '', definition: '' } ]);
  const [itemsAndCategories, setItemsAndCategories] = useState({ categories: [''], items: [{ name: '', category: '' }] });
  const { toast } = useToast();

  const gameTypeDetails = {
    // 2. Adicione o novo tipo de jogo aqui
    association: { name: 'Jogo de Associação', description: 'Digite a definição', icon: Lightbulb, color: 'bg-yellow-500' },
    memory: { name: 'Jogo da Memória', description: 'Encontre pares', icon: Brain, color: 'bg-blue-500' },
    quiz: { name: 'Quiz', description: 'Escolha a definição', icon: Target, color: 'bg-green-500' },
    dragdrop: { name: 'Arrastar e Soltar', description: 'Agrupe itens', icon: Shuffle, color: 'bg-red-500' }
  };

  const handleCreateGame = () => {
    if (!gameType || !title.trim()) {
        toast({ title: "Erro", description: "Título e tipo de jogo são obrigatórios.", variant: "destructive" });
        return;
    }

    const gamePayload = {
      title: title.trim(),
      description: description.trim(),
      gameType: gameType,
    };

    let dataPayload;
    // 3. Adicione o 'association' a esta condição
    if (gameType === 'memory' || gameType === 'quiz' || gameType === 'association') {
      dataPayload = { termsAndDefinitions: termsAndDefinitions.filter(p => p.term.trim() && p.definition.trim()) };
    } else if (gameType === 'dragdrop') {
      dataPayload = {
        itemsAndCategories: {
          categories: itemsAndCategories.categories.filter(c => c.trim()),
          items: itemsAndCategories.items.filter(i => i.name.trim() && i.category.trim())
        }
      };
    }
    
    gamePayload.data = dataPayload;
    onCreateGame(gamePayload);
  };
  
  // ... O resto do seu arquivo GameCreator.jsx continua igual ...
  // (O return com os formulários, etc.)

  if (!gameType) {
    return ( <GameTypeSelector onSelectType={setGameType} onCancel={onCancel} gameTypeDetails={gameTypeDetails} /> );
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
            <h2 className="text-xl font-semibold text-gray-800">Criar {selectedTypeInfo.name}</h2>
            <p className="text-sm text-gray-500">{selectedTypeInfo.description}</p>
          </div>
        </div>
        <Button onClick={() => setGameType('')} variant="ghost" className="text-gray-600 hover:bg-gray-100 text-sm">
          <ArrowLeft className="h-4 w-4 mr-1" /> Mudar Tipo
        </Button>
      </div>
      <BasicInfoForm title={title} setTitle={setTitle} description={description} setDescription={setDescription} />
      {(gameType === 'memory' || gameType === 'quiz' || gameType === 'association') && (
        <TermsDefinitionsForm termsAndDefinitions={termsAndDefinitions} setTermsAndDefinitions={setTermsAndDefinitions} />
      )}
      {gameType === 'dragdrop' && (
        <ItemsCategoriesForm itemsAndCategories={itemsAndCategories} setItemsAndCategories={setItemsAndCategories} />
      )}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button onClick={onCancel} variant="outline" className="text-sm">Cancelar</Button>
        <Button onClick={handleCreateGame} className="bg-green-500 hover:bg-green-600 text-white text-sm">
          <Save className="h-4 w-4 mr-1" /> Criar Jogo
        </Button>
      </div>
    </div>
  );
};

export default GameCreator;
