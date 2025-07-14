import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, PlusCircle, X } from 'lucide-react';

const GameCreator = ({ onCreateGame, onCancel }) => {
  const [title, setTitle] = useState('');
  const [gameType, setGameType] = useState('memory');
  const [pairs, setPairs] = useState([{ term: '', definition: '' }]);
  const [isPublic, setIsPublic] = useState(true);

  const handlePairChange = (index, field, value) => {
    const newPairs = [...pairs];
    newPairs[index][field] = value;
    setPairs(newPairs);
  };

  const addPair = () => {
    setPairs([...pairs, { term: '', definition: '' }]);
  };

  const removePair = (index) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || pairs.some(p => !p.term || !p.definition)) {
      alert('Por favor, preencha o título e todos os campos de termos e definições.');
      return;
    }

    const gameData = {
      title,
      gameType,
      isPublic,
      data: {
        termsAndDefinitions: pairs,
      }
    };
    onCreateGame(gameData);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Criar Novo Jogo</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">Título do Jogo</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Capitais do Brasil" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gameType" className="text-sm font-medium">Tipo de Jogo</Label>
          <Select value={gameType} onValueChange={setGameType}>
            <SelectTrigger id="gameType">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="memory">Jogo da Memória</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="association">Associação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Pares de Termos e Definições</Label>
          <div className="space-y-3 mt-2">
            {pairs.map((pair, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <Input value={pair.term} onChange={(e) => handlePairChange(index, 'term', e.target.value)} placeholder={`Termo ${index + 1}`} required className="w-1/2"/>
                <Input value={pair.definition} onChange={(e) => handlePairChange(index, 'definition', e.target.value)} placeholder={`Definição ${index + 1}`} required className="w-1/2"/>
                <Button type="button" variant="ghost" size="icon" onClick={() => removePair(index)} disabled={pairs.length === 1}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addPair} className="mt-3">
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Par
          </Button>
        </div>

        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
           <Label htmlFor="is-public" className="text-sm font-medium text-blue-800">
              Jogo Público?
              <p className="text-xs text-blue-600">Jogos públicos aparecem para todos. Privados só para você.</p>
           </Label>
           <Switch id="is-public" checked={isPublic} onCheckedChange={setIsPublic} />
        </div>

        {pairs.length < 2 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-3 rounded-md text-sm flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2"/>
            Recomendamos criar pelo menos 2 pares para uma melhor experiência de jogo.
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Salvar Jogo</Button>
        </div>
      </form>
    </div>
  );
};

export default GameCreator;