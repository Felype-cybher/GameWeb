import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ChevronRight, AlertTriangle } from 'lucide-react';

const AssociationGame = ({ gameData, onCorrectAnswer, onWrongAnswer, onGameEnd, setTotalQuestions }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [localCorrectCount, setLocalCorrectCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const pairs = gameData.termsAndDefinitions || [];
    setTotalQuestions(pairs.length);
    // Embaralha as perguntas ao iniciar o jogo
    setQuestions(pairs.sort(() => Math.random() - 0.5));
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setIsAnswered(false);
    setWasCorrect(false);
    setLocalCorrectCount(0);
  }, [gameData, setTotalQuestions]);

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (isAnswered) return;

    const currentQuestion = questions[currentQuestionIndex];
    // Compara as respostas ignorando maiúsculas/minúsculas e espaços extras
    const correctAnswer = currentQuestion.definition.trim().toLowerCase();
    const userAnswerClean = userAnswer.trim().toLowerCase();

    if (userAnswerClean === correctAnswer) {
      setWasCorrect(true);
      setLocalCorrectCount(prev => prev + 1);
      onCorrectAnswer(25); // Pontuação maior por ser mais difícil
      toast({ title: "Correto!", description: "Você acertou em cheio!" });
    } else {
      setWasCorrect(false);
      onWrongAnswer();
      toast({
        title: "Quase lá!",
        description: `A resposta correta era: "${currentQuestion.definition}"`,
        variant: "destructive"
      });
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setIsAnswered(false);
      setWasCorrect(false);
    } else {
      // Fim de jogo
      onGameEnd(null, localCorrectCount, questions.length); // Envia os resultados para o App.jsx
    }
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 text-center">
        <AlertTriangle className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
        <p className="text-gray-600">Este jogo não possui termos e definições para jogar.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow space-y-4">
      <div className="flex items-center justify-between pb-3 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Jogo de Associação</h3>
        <span className="text-sm font-medium text-gray-600">Questão: {currentQuestionIndex + 1}/{questions.length}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full transition-width duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="text-center py-4">
        <p className="text-gray-600 mb-2">Qual a definição do termo:</p>
        <h2 className="text-2xl font-bold text-purple-700">{currentQuestion.term}</h2>
      </div>

      <form onSubmit={handleSubmitAnswer} className="space-y-3">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Digite a definição aqui..."
          disabled={isAnswered}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
        {!isAnswered && (
          <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
            Verificar Resposta
          </Button>
        )}
      </form>

      {isAnswered && (
        <div className={`p-3 rounded-md text-center ${wasCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-semibold">{wasCorrect ? 'Parabéns, você acertou!' : 'Resposta incorreta.'}</p>
          {!wasCorrect && <p>A resposta correta era: <span className="font-bold">"{currentQuestion.definition}"</span></p>}
          <Button onClick={handleNextQuestion} className="mt-3 bg-purple-500 hover:bg-purple-600 text-white">
            {currentQuestionIndex < questions.length - 1 ? 'Próxima Questão' : 'Finalizar Jogo'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AssociationGame;
