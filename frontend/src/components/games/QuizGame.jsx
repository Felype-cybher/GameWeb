import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ChevronRight, RotateCcw, AlertTriangle } from 'lucide-react';

const QuizGame = ({ gameData, onCorrectAnswer, onWrongAnswer, onGameEnd, setTotalQuestions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null); // Index da opção selecionada
  const [isAnswered, setIsAnswered] = useState(false);
  const [localCorrectAnswers, setLocalCorrectAnswers] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    initializeQuiz();
  }, [gameData]);

  const initializeQuiz = () => {
    const pairs = gameData.termsAndDefinitions || [];
    setTotalQuestions(pairs.length);
    
    if (pairs.length < 2) { // Precisa de pelo menos 2 pares para ter alternativas
      setQuestions([]);
      return;
    }

    const quizQuestions = pairs.map((pair, index) => {
      const incorrectOptions = pairs
        .filter((_, i) => i !== index) 
        .map(p => p.definition)
        .sort(() => 0.5 - Math.random()) 
        .slice(0, Math.min(3, pairs.length - 1)); // Máximo 3 alternativas incorretas
      
      const options = [pair.definition, ...incorrectOptions].sort(() => 0.5 - Math.random());
      
      return {
        term: pair.term,
        correctAnswer: pair.definition,
        options: options,
      };
    });
    
    setQuestions(quizQuestions.sort(() => 0.5 - Math.random()));
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setLocalCorrectAnswers(0);
  };

  const handleOptionSelect = (option) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    const currentQ = questions[currentQuestionIndex];
    if (option === currentQ.correctAnswer) {
      setLocalCorrectAnswers(prev => prev + 1);
      onCorrectAnswer(15);
      toast({ title: "Correto!", description: "Mandou bem!" });
    } else {
      onWrongAnswer();
      toast({ title: "Errado!", description: `A resposta era: ${currentQ.correctAnswer}`, variant: "destructive" });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onGameEnd(localCorrectAnswers * 15, localCorrectAnswers, questions.length);
    }
  };

  const resetQuiz = () => {
    initializeQuiz();
  };

  if (questions.length === 0 && gameData.termsAndDefinitions?.length > 0) {
     return (
        <div className="bg-white rounded-lg p-4 md:p-6 shadow text-center">
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 mr-2"/>
            <p className="text-sm">Este jogo precisa de pelo menos 2 pares de termos/definições para gerar alternativas.</p>
          </div>
           <Button onClick={resetQuiz} variant="outline" size="sm" className="text-xs mt-4">
            <RotateCcw className="h-3 w-3 mr-1" /> Tentar Recarregar
          </Button>
        </div>
      );
  }
  if (questions.length === 0) {
    return <div className="bg-white rounded-lg p-4 md:p-6 shadow text-center text-gray-500">Carregando Quiz...</div>;
  }


  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between pb-3 border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Quiz</h3>
          <p className="text-xs text-gray-500">Escolha a definição correta.</p>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0 text-xs">
          <div className="text-gray-600">Questão: <span className="font-semibold">{currentQuestionIndex + 1}/{questions.length}</span></div>
          <div className="text-gray-600">Acertos: <span className="font-semibold">{localCorrectAnswers}</span></div>
          <Button onClick={resetQuiz} variant="outline" size="sm" className="text-xs p-1 h-auto">
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div>
        <div className="bg-gray-100 rounded-md p-3 mb-3">
          <p className="text-sm text-gray-600 mb-1">O que é <span className="font-semibold text-purple-700">{question.term}</span>?</p>
        </div>
        
        <div className="space-y-2">
          {question.options.map((option, index) => {
            let buttonClass = "w-full text-left p-2 border rounded-md text-sm transition-colors ";
            if (isAnswered) {
              if (option === question.correctAnswer) {
                buttonClass += "bg-green-100 border-green-400 text-green-700";
              } else if (option === selectedOption) {
                buttonClass += "bg-red-100 border-red-400 text-red-700";
              } else {
                buttonClass += "bg-gray-50 border-gray-200 text-gray-500 opacity-70";
              }
            } else {
              buttonClass += "bg-white border-gray-300 hover:bg-purple-50 hover:border-purple-400 text-gray-700";
            }
            
            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={isAnswered}
                className={buttonClass}
              >
                {String.fromCharCode(65 + index)}) {option}
              </button>
            );
          })}
        </div>
        
        {isAnswered && (
          <div className="mt-4 text-right">
            <Button
              onClick={handleNextQuestion}
              className="bg-purple-500 hover:bg-purple-600 text-white text-sm"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Próxima' : 'Finalizar'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame;