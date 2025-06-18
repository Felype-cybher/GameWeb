import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Medal, 
  Award, 
  Clock, 
  Target, 
  Star,
  Filter
} from 'lucide-react';

const Rankings = ({ results, games }) => {
  const [selectedGame, setSelectedGame] = useState('all');
  const [sortBy, setSortBy] = useState('score'); 

  const filteredResults = useMemo(() => {
    let filtered = results;
    if (selectedGame !== 'all') {
      filtered = results.filter(result => result.gameId === selectedGame);
    }
    return filtered.sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'time') return a.timeSpent - b.timeSpent;
      const accA = (a.correctAnswers / a.totalQuestions) * 100 || 0;
      const accB = (b.correctAnswers / b.totalQuestions) * 100 || 0;
      if (sortBy === 'accuracy') return accB - accA;
      return b.score - a.score;
    });
  }, [results, selectedGame, sortBy]);

  const getRankIcon = (position) => {
    if (position === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (position === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (position === 2) return <Award className="h-5 w-5 text-orange-400" />;
    return <span className="text-sm font-semibold text-gray-600">#{position + 1}</span>;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const getAccuracy = (result) => {
    return result.totalQuestions > 0 
      ? Math.round((result.correctAnswers / result.totalQuestions) * 100)
      : 0;
  };

  if (results.length === 0) {
    return (
      <div
        className="bg-white rounded-lg p-8 text-center shadow"
      >
        <img  
            className="w-24 h-24 mx-auto mb-3 opacity-40"
            alt="Troféu triste"
           src="https://images.unsplash.com/photo-1638739641967-bc833d955385" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Ranking Vazio
        </h3>
        <p className="text-gray-500 text-sm">
          Jogue alguns jogos para aparecer aqui!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="bg-white rounded-lg p-4 shadow"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
            Melhores Pontuações
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            <div className="flex items-center space-x-1">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white w-full sm:w-auto"
              >
                <option value="all">Todos os Jogos</option>
                {games.map(game => (
                  <option key={game.id} value={game.id}>
                    {game.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-1">
              {['score', 'time', 'accuracy'].map(criteria => (
                <Button
                  key={criteria}
                  onClick={() => setSortBy(criteria)}
                  variant={sortBy === criteria ? 'default' : 'outline'}
                  size="sm"
                  className={`text-xs px-2 py-1 h-auto ${sortBy === criteria ? 'bg-purple-500 text-white' : 'text-gray-600 border-gray-300'}`}
                >
                  {criteria === 'score' ? 'Pontos' : criteria === 'time' ? 'Tempo' : 'Precisão'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-lg p-4 shadow"
      >
        {filteredResults.length === 0 ? (
          <p className="text-center text-gray-500 py-4 text-sm">Nenhum resultado para este filtro.</p>
        ) : (
          <div className="space-y-3">
            {filteredResults.slice(0, 10).map((result, index) => { // Limitar a 10 resultados
              const game = games.find(g => g.id === result.gameId);
              const accuracy = getAccuracy(result);
              
              return (
                <div
                  key={result.id}
                  className={`border rounded-md p-3 ${
                    index < 3 ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(index)}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700">
                          {result.playerName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {game?.title || 'Jogo Desconhecido'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="text-center">
                        <div className="font-semibold text-yellow-600">
                          {result.score}
                        </div>
                        <div className="text-gray-500">Pts</div>
                      </div>
                      
                      <div className="text-center hidden sm:block">
                        <div className="font-semibold text-green-600">
                          {accuracy}%
                        </div>
                        <div className="text-gray-500">OK</div>
                      </div>
                      
                      <div className="text-center hidden md:block">
                        <div className="font-semibold text-blue-600">
                          {formatTime(result.timeSpent)}
                        </div>
                        <div className="text-gray-500">Tempo</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rankings;