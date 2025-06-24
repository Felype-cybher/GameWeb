import React, { useState, useEffect } from 'react';
// 1. IMPORTAÇÕES CORRIGIDAS ABAIXO
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, RotateCcw } from 'lucide-react';

// Importa todos os componentes de jogo
import MemoryGame from '@/components/games/MemoryGame';
import QuizGame from '@/components/games/QuizGame';
import DragDropGame from '@/components/games/DragDropGame';
import AssociationGame from '@/components/games/AssociationGame';

const GamePlayer = ({ game, player, onGameComplete, onExit }) => {
  const [gameState, setGameState] = useState('playing'); 
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [streak, setStreak] = useState(0);
  const { toast } = useToast();

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
      score: finalScore !== null ? finalScore : score,
      correctAnswers: finalCorrect,
      totalQuestions: finalTotal,
      timeSpent: finalTime
    });
  };

  const restartGame = () => {
    setGameState('restarting');
    setTimeout(() => {
      setScore(0);
      setCorrectAnswers(0);
      setTimeSpent(0);
      setStartTime(Date.now());
      setStreak(0);
      setGameState('playing');
    }, 50); 
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

  const renderGameComponent = () => {
    if (gameState === 'restarting') return null;

    const commonProps = {
      gameData: game.data,
      onCorrectAnswer: handleCorrectAnswer,
      onWrongAnswer: handleWrongAnswer,
      onGameEnd: handleGameEnd,
      setTotalQuestions
    };

    switch (game.gameType) {
      case 'association': return <AssociationGame key={startTime} {...commonProps} />;
      case 'memory': return <MemoryGame key={startTime} {...commonProps} />;
      case 'quiz': return <QuizGame key={startTime} {...commonProps} />;
      case 'dragdrop': return <DragDropGame key={startTime} {...commonProps} />;
      default: return <div className="text-red-500 p-4 bg-red-100 rounded-md">Erro: Tipo de jogo desconhecido.</div>;
    }
  };

  // --- Tela de Resultados ---
  if (gameState === 'completed') {
    return (
      <div className="bg-white rounded-lg p-6 text-center shadow-md max-w-lg mx-auto">
        <img className="w-24 h-24 mx-auto mb-3" src="https://img.icons8.com/plasticine/100/trophy.png" alt="Troféu de vencedor"/>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Fim de Jogo, {player?.nome || 'Jogador'}!
        </h2>
        <p className="text-gray-600 mb-6">{getPerformanceMessage()}</p>
        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="bg-gray-100 rounded-md p-3"><div className="font-semibold text-gray-700">{score}</div><div className="text-gray-500">Pontos</div></div>
          <div className="bg-gray-100 rounded-md p-3"><div className="font-semibold text-gray-700">{correctAnswers}/{totalQuestions}</div><div className="text-gray-500">Acertos</div></div>
          <div className="bg-gray-100 rounded-md p-3"><div className="font-semibold text-gray-700">{formatTime(timeSpent)}</div><div className="text-gray-500">Tempo</div></div>
          <div className="bg-gray-100 rounded-md p-3"><div className="font-semibold text-gray-700">{totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%</div><div className="text-gray-500">Precisão</div></div>
        </div>
        <div className="flex justify-center space-x-3">
          <Button onClick={restartGame} className="bg-blue-500 hover:bg-blue-600 text-white px-5 text-sm"><RotateCcw className="h-4 w-4 mr-1" />Jogar de Novo</Button>
          <Button onClick={onExit} variant="outline" className="px-5 text-sm"><ArrowLeft className="h-4 w-4 mr-1" />Sair</Button>
        </div>
      </div>
    );
  }

  // --- Tela de Jogo Principal ---
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-800">{game.title}</h1>
            <Button onClick={onExit} variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100 p-1"><ArrowLeft className="h-5 w-5" /></Button>
        </div>
      </div>
      <div className="bg-white rounded-lg p-3 shadow">
        <div className="flex items-center justify-around text-xs">
          <div className="text-center"><div className="font-semibold text-purple-600">{score}</div><div className="text-gray-500">Pontos</div></div>
          <div className="text-center"><div className="font-semibold text-green-600">{correctAnswers}/{totalQuestions || '?'}</div><div className="text-gray-500">Acertos</div></div>
          <div className="text-center"><div className="font-semibold text-blue-600">{formatTime(timeSpent)}</div><div className="text-gray-500">Tempo</div></div>
          {streak > 0 && (<div className="text-center"><div className="font-semibold text-orange-500">🔥 {streak}x</div><div className="text-gray-500">Combo</div></div>)}
        </div>
      </div>
      <div>{renderGameComponent()}</div>
    </div>
  );
};

export default GamePlayer;
