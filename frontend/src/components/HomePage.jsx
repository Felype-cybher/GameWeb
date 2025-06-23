import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, Plus, Brain, Target, Shuffle, Clock, User, Trophy, Lightbulb
} from 'lucide-react';

const HomePage = ({ games, onPlayGame, onCreateGame, currentPlayer }) => {
  const gameTypeIcons = {
    association: Lightbulb,
    memory: Brain,
    quiz: Target,
    dragdrop: Shuffle
  };

  const gameTypeLabels = {
    association: 'Associação',
    memory: 'Jogo da Memória',
    quiz: 'Quiz',
    dragdrop: 'Arrastar e Soltar'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 text-center shadow">
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          Bem-vindo, {currentPlayer?.nome || 'Jogador'}!
        </h2>
        <p className="text-gray-600 mb-6">
          Escolha um jogo para começar ou crie o seu.
        </p>
        <Button onClick={onCreateGame} size="lg" className="bg-purple-500 hover:bg-purple-600 text-white">
          <Plus className="h-5 w-5 mr-2" />
          Criar Novo Jogo
        </Button>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
          Jogos Disponíveis ({games.length})
        </h3>
        
        {games.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow">
            <h4 className="text-lg font-medium text-gray-700 mb-1">Nenhum jogo por aqui...</h4>
            <p className="text-gray-500 mb-4 text-sm">Seja o primeiro a criar um!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => {
              const IconComponent = gameTypeIcons[game.gameType];
              const label = gameTypeLabels[game.gameType];
              
              return (
                <div key={game._id} className="bg-white rounded-lg p-4 shadow hover:shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-purple-500 p-2 rounded-md">
                        {IconComponent && <IconComponent className="h-5 w-5 text-white" />}
                      </div>
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full font-medium">
                        {label || 'Jogo'}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1 truncate">{game.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 h-10 overflow-hidden">{game.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center"><User className="h-3 w-3 mr-1" /><span>{game.createdBy}</span></div>
                      <div className="flex items-center"><Clock className="h-3 w-3 mr-1" /><span>{new Date(game.createdAt).toLocaleDateString()}</span></div>
                    </div>
                  </div>
                  <Button onClick={() => onPlayGame(game)} className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white">
                    <Play className="h-4 w-4 mr-1" />
                    Jogar
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
