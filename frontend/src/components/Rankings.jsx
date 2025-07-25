import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Filter } from 'lucide-react';

const Rankings = ({ results, games }) => {
  const [selectedGame, setSelectedGame] = useState('all');
  const [sortBy, setSortBy] = useState('score'); 

  const filteredResults = useMemo(() => {
    let filtered = results;
    if (selectedGame !== 'all') {
      filtered = results.filter(result => result.gameId === selectedGame);
    }
    
    // --- LÓGICA DE ORDENAÇÃO CORRIGIDA ---
    return [...filtered].sort((a, b) => {
      // Ordenando por Pontos (critério principal)
      if (sortBy === 'score') {
        // 1. Compara os pontos. Se forem diferentes, ordena por pontos.
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // 2. Se os pontos forem iguais, usa o TEMPO como desempate (menor tempo é melhor).
        return a.timeSpent - b.timeSpent;
      }
      
      // Ordenando por Tempo (menor tempo é melhor)
      if (sortBy === 'time') {
         // 1. Compara o tempo. Se for diferente, ordena por tempo.
        if (a.timeSpent !== b.timeSpent) {
            return a.timeSpent - b.timeSpent;
        }
        // 2. Se o tempo for igual, usa a PONTUAÇÃO como desempate.
        return b.score - a.score;
      }
      
      // Ordenando por Precisão
      if (sortBy === 'accuracy') {
        const accA = a.totalQuestions > 0 ? (a.correctAnswers / a.totalQuestions) : 0;
        const accB = b.totalQuestions > 0 ? (b.correctAnswers / b.totalQuestions) : 0;
        // 1. Compara a precisão. Se for diferente, ordena.
        if (accB !== accA) {
            return accB - accA;
        }
        // 2. Se a precisão for igual, usa a PONTUAÇÃO como desempate.
        return b.score - a.score;
      }
      
      return 0; // Caso padrão
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-yellow-500" /> Melhores Pontuações
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
                  <option key={game._id} value={game._id}>
                    {game.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-1">
              {['score', 'time', 'accuracy'].map(criteria => (
                <Button key={criteria} onClick={() => setSortBy(criteria)} variant={sortBy === criteria ? 'default' : 'outline'} size="sm" className={`text-xs px-2 py-1 h-auto ${sortBy === criteria ? 'bg-purple-500 text-white' : 'text-gray-600 border-gray-300'}`}>
                  {criteria === 'score' ? 'Pontos' : criteria === 'time' ? 'Tempo' : 'Precisão'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow">
        {filteredResults.length === 0 ? (
          <p className="text-center text-gray-500 py-4 text-sm">Nenhum resultado para este filtro.</p>
        ) : (
          <div className="space-y-3">
            {filteredResults.slice(0, 10).map((result, index) => {
              const accuracy = getAccuracy(result);
              return (
                <div key={result._id || index} className={`border rounded-md p-3 ${index < 3 ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8">{getRankIcon(index)}</div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700">{result.playerName}</h4>
                        <p className="text-xs text-gray-500">{result.gameDetails?.title || 'Jogo desconhecido'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="text-center"><div className="font-semibold text-yellow-600">{result.score}</div><div className="text-gray-500">Pts</div></div>
                      <div className="text-center hidden sm:block"><div className="font-semibold text-green-600">{accuracy}%</div><div className="text-gray-500">OK</div></div>
                      <div className="text-center"><div className="font-semibold text-blue-600">{formatTime(result.timeSpent)}</div><div className="text-gray-500">Tempo</div></div>
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
