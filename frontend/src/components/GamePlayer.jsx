import React, { useState, useEffect } from 'react';
// ... outros imports
import MemoryGame from '@/components/games/MemoryGame';
import QuizGame from '@/components/games/QuizGame';
import DragDropGame from '@/components/games/DragDropGame';
import AssociationGame from '@/components/games/AssociationGame'; // <-- 1. Importe o novo jogo

const GamePlayer = ({ game, player, onGameComplete, onExit }) => {
  // ... toda a lógica do seu GamePlayer continua igual ...

  const renderGameComponent = () => {
    const commonProps = {
      gameData: game.data,
      onCorrectAnswer: handleCorrectAnswer,
      onWrongAnswer: handleWrongAnswer,
      onGameEnd: handleGameEnd,
      setTotalQuestions
    };

    switch (game.gameType) {
      // 2. Adicione o case para o novo jogo
      case 'association':
        return <AssociationGame {...commonProps} />;
      case 'memory':
        return <MemoryGame {...commonProps} />;
      case 'quiz':
        return <QuizGame {...commonProps} />;
      case 'dragdrop':
        return <DragDropGame {...commonProps} />;
      default:
        return <div className="text-red-500 p-4 bg-red-100 rounded-md">Erro: Tipo de jogo desconhecido.</div>;
    }
  };

  // ... O resto do seu arquivo GamePlayer.jsx continua igual ...
  // (A lógica de estado, useEffects e o return com a tela de resultado, etc.)

  const [gameState, setGameState] = useState('playing');
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameState === 'playing') {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, startTime]);

  const handleCorrectAnswer = (points = 10) => {
    setScore(prev => prev + points + (streak * 2));
    setCorrectAnswers(prev => prev + 1);
    const newStreak = streak + 1;
    setStreak(newStreak);
  };

  const handleWrongAnswer = () => {
    setStreak(0);
  };

  const handleGameEnd = (finalScore, finalCorrect, finalTotal) => {
    const finalTime = Math.floor((Date.now() - startTime) / 1000);
    setGameState('completed');
    setTimeSpent(finalTime);
    
    onGameComplete({
      score: finalScore || score,
      correctAnswers: finalCorrect,
      totalQuestions: finalTotal,
      timeSpent: finalTime
    });
  };

  const restartGame = () => {
    // A lógica de restart pode ser melhorada para chamar o useEffect do jogo filho
    setGameState('playing');
    setScore(0);
    setCorrectAnswers(0);
    setTimeSpent(0);
    setStartTime(Date.now());
    setStreak(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const getPerformanceMessage = () => {
    if (totalQuestions === 0) return "Jogo concluído!";
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage >= 80) return "Excelente!";
    if (percentage >= 50) return "Bom trabalho!";
    return "Continue praticando!";
  };


  if (gameState === 'completed') {
    return (
      <div className="bg-white rounded-lg p-6 text-center shadow-md max-w-lg mx-auto">
         <img className="w-24 h-24 mx-auto mb-3" src="https://img.icons8.com/plasticine/100/trophy.png" alt="Troféu de vencedor"/>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Fim de Jogo, {player.nome}!
        </h2>
        <p className="text-gray-600 mb-6">{getPerformanceMessage()}</p>
        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="bg-gray-100 rounded-md p-3">
            <div className="font-semibold text-gray-700">{score}</div>
            <div className="text-gray-500">Pontos</div>
          </div>
          <div className="bg-gray-100 rounded-md p-3">
            <div className="font-semibold text-gray-700">{correctAnswers}/{totalQuestions}</div>
            <div className="text-gray-500">Acertos</div>
          </div>
          <div className="bg-gray-100 rounded-md p-3">
            <div className="font-semibold text-gray-700">{formatTime(timeSpent)}</div>
            <div className="text-gray-500">Tempo</div>
          </div>
          <div className="bg-gray-100 rounded-md p-3">
            <div className="font-semibold text-gray-700">{totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%</div>
            <div className="text-gray-500">Precisão</div>
          </div>
        </div>
        <div className="flex justify-center space-x-3">
          <Button onClick={restartGame} className="bg-blue-500 hover:bg-blue-600 text-white px-5 text-sm">
            Jogar de Novo
          </Button>
          <Button onClick={onExit} variant="outline" className="px-5 text-sm">
            Sair
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* O cabeçalho e a barra de status continuam iguais */}
      <div>{renderGameComponent()}</div>
    </div>
  );
};

export default GamePlayer;
