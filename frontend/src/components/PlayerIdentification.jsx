import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { User, ArrowLeft, Play } from 'lucide-react';

const PlayerIdentification = ({ onPlayerIdentified, onCancel }) => {
  const [playerName, setPlayerName] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      toast({
        title: "Nome em branco",
        description: "Por favor, digite seu nome."
      });
      return;
    }

    if (playerName.trim().length < 2) {
      toast({
        title: "Nome curto",
        description: "O nome precisa ter pelo menos 2 letras."
      });
      return;
    }
    
    const playerData = {
      name: playerName.trim(),
      id: Date.now().toString(), // Simples ID
    };
    
    onPlayerIdentified(playerData);
    
    toast({
      title: "Bem-vindo(a)!",
      description: `Olá ${playerData.name}! Bom jogo!`
    });
  };

  return (
    <div
      className="bg-white rounded-lg p-6 shadow-md max-w-sm mx-auto"
    >
      <div className="text-center mb-6">
        <div className="bg-purple-500 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
          <User className="h-8 w-8 text-white" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Quem está jogando?
        </h2>
        <p className="text-sm text-gray-600">
          Digite seu nome para começar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
            Seu Nome:
          </label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Ex: Ana Silva"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            maxLength={30}
          />
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-3 rounded">
          <p className="text-xs">
            Seu nome será usado para mostrar seus recordes!
          </p>
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
          
          <Button
            type="submit"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm"
          >
            <Play className="h-4 w-4 mr-1" />
            Começar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PlayerIdentification;