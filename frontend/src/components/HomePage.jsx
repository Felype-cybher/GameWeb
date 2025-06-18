import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Plus, 
  Brain, 
  Target, 
  Shuffle,
  Clock,
  User,
  Trophy
} from 'lucide-react';

const HomePage = ({ games, onPlayGame, onCreateGame, currentPlayer }) => {
  const gameTypeIcons = {
    memory: Brain,
    quiz: Target,
    dragdrop: Shuffle
  };

  const gameTypeLabels = {
    memory: 'Jogo da Memória',
    quiz: 'Quiz',
    dragdrop: 'Arrastar e Soltar'
  };

  return (
    <div className="space-y-6">
      <div
        className="bg-white rounded-lg p-6 text-center shadow"
      >
        <img  
            className="w-24 h-24 mx-auto mb-3 rounded-full object-cover border-4 border-purple-200"
            alt="Mascote sorrindo"
           src="https://images.unsplash.com/photo-1677498409838-ec0d032a17f0" />
        
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          Bem-vindo!
        </h2>
        <p className="text-gray-600 mb-6">
          Escolha um jogo ou crie o seu!
        </p>
        
        {!currentPlayer && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4 rounded">
            <p className="text-sm">
              Identifique-se para salvar seus resultados!
            </p>
          </div>
        )}
        
        <Button
          onClick={onCreateGame}
          size="lg"
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md text-base font-medium shadow hover:shadow-md"
        >
          <Plus className="h-5 w-5 mr-2" />
          Criar Novo Jogo
        </Button>
      </div >

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
          Jogos Disponíveis ({games.length})
        </h3>
        
        {games.length === 0 ? (
          <div
            className="bg-white rounded-lg p-8 text-center shadow"
          >
             <img  
                className="w-20 h-20 mx-auto mb-3 opacity-40"
                alt="Controle de video game"
               src="https://images.unsplash.com/photo-1558371485-a64dc35ca619" />
            <h4 className="text-lg font-medium text-gray-700 mb-1">
              Nenhum jogo por aqui...
            </h4>
            <p className="text-gray-500 mb-4 text-sm">
              Que tal criar o primeiro?
            </p>
            <Button
              onClick={onCreateGame}
              className="bg-green-500 hover:bg-green-600 text-white text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Criar Jogo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => {
              const IconComponent = gameTypeIcons[game.type];
              return (
                <div
                  key={game.id}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-purple-500 p-2 rounded-md">
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full font-medium">
                      {gameTypeLabels[game.type]}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">
                    {game.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3 h-10 overflow-hidden">
                    {game.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {game.createdBy}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(game.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => onPlayGame(game)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md text-sm"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Jogar
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        className="bg-white rounded-lg p-6 shadow"
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Tipos de Jogos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 border border-gray-200 rounded-md">
            <div className="bg-blue-500 p-3 rounded-md w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-md font-medium text-gray-700 mb-1">
              Memória
            </h4>
            <p className="text-gray-500 text-xs">
              Encontre os pares.
            </p>
          </div>
          
          <div className="text-center p-3 border border-gray-200 rounded-md">
            <div className="bg-green-500 p-3 rounded-md w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-md font-medium text-gray-700 mb-1">
              Quiz
            </h4>
            <p className="text-gray-500 text-xs">
              Acerte a definição.
            </p>
          </div>
          
          <div className="text-center p-3 border border-gray-200 rounded-md">
            <div className="bg-red-500 p-3 rounded-md w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Shuffle className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-md font-medium text-gray-700 mb-1">
              Arrastar e Soltar
            </h4>
            <p className="text-gray-500 text-xs">
              Agrupe os itens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;