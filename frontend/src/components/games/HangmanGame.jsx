import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Lightbulb } from 'lucide-react';

const HangmanDrawing = ({ numberOfGuesses }) => {
  const HEAD = <circle key="head" cx="210" cy="70" r="20" stroke="currentColor" strokeWidth="4" fill="none" />;
  const BODY = <line key="body" x1="210" y1="90" x2="210" y2="150" stroke="currentColor" strokeWidth="4" />;
  const RIGHT_ARM = <line key="right_arm" x1="210" y1="110" x2="240" y2="130" stroke="currentColor" strokeWidth="4" />;
  const LEFT_ARM = <line key="left_arm" x1="210" y1="110" x2="180" y2="130" stroke="currentColor" strokeWidth="4" />;
  const RIGHT_LEG = <line key="right_leg" x1="210" y1="150" x2="240" y2="180" stroke="currentColor" strokeWidth="4" />;
  const LEFT_LEG = <line key="left_leg" x1="210" y1="150" x2="180" y2="180" stroke="currentColor" strokeWidth="4" />;
  const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

  return (
    <div className="flex justify-center items-center h-52 md:h-64">
      <svg viewBox="0 0 280 280" className="w-full h-full text-gray-800">
        <line x1="20" y1="230" x2="140" y2="230" stroke="currentColor" strokeWidth="4" />
        <line x1="80" y1="230" x2="80" y2="50" stroke="currentColor" strokeWidth="4" />
        <line x1="80" y1="50" x2="210" y2="50" stroke="currentColor" strokeWidth="4" />
        <line x1="210" y1="50" x2="210" y2="70" stroke="currentColor" strokeWidth="3" />
        {BODY_PARTS.slice(0, numberOfGuesses)}
      </svg>
    </div>
  );
};

const HangmanGame = ({ gameData, onCorrectAnswer, onWrongAnswer, onGameEnd, setTotalQuestions }) => {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);
  
  const initializeGame = useCallback(() => {
    const wordList = gameData.wordList || [];
    setTotalQuestions(wordList.length);
    setWords(wordList.map(item => ({
      ...item,
      word: item.word.toUpperCase(),
      wordToGuess: item.word.toUpperCase().replace(/[^A-Z]/g, '')
    })).sort(() => Math.random() - 0.5));
    setCurrentWordIndex(0);
    setGuessedLetters([]);
  }, [gameData, setTotalQuestions]);
  
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  
  const originalWord = words[currentWordIndex]?.word || '';
  const wordToGuess = words[currentWordIndex]?.wordToGuess || '';
  const hint = words[currentWordIndex]?.hint || '';

  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter));
  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess && wordToGuess.split('').every(letter => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback((letter) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return;
    setGuessedLetters(currentLetters => [...currentLetters, letter]);
  }, [guessedLetters, isWinner, isLoser]);
  
  useEffect(() => {
    if (isWinner && wordToGuess) {
      onCorrectAnswer(50 - incorrectLetters.length * 5);
      const isLastWord = currentWordIndex === words.length - 1;
      setTimeout(() => {
        if (isLastWord) {
            onGameEnd(null, words.length, words.length);
        } else {
            setCurrentWordIndex(i => i + 1);
            setGuessedLetters([]);
        }
      }, 1200);
    }
  }, [isWinner, wordToGuess, currentWordIndex, words.length, onCorrectAnswer, onGameEnd, incorrectLetters.length]);
  
  // *** INÍCIO DA CORREÇÃO PRINCIPAL ***
  useEffect(() => {
    if (isLoser) {
      onWrongAnswer();
      // Quando o jogador perde, o jogo deve terminar imediatamente.
      // Calculamos quantos acertos ele teve até agora.
      const correctAnswersCount = currentWordIndex; 
      
      setTimeout(() => {
        // Chamamos a função onGameEnd para finalizar a partida.
        onGameEnd(null, correctAnswersCount, words.length);
      }, 1500); // Damos um tempo para o jogador ver a palavra correta.
    }
  }, [isLoser, onWrongAnswer, onGameEnd, currentWordIndex, words.length]);
  // *** FIM DA CORREÇÃO PRINCIPAL ***

  const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  if (words.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6 shadow text-center flex items-center justify-center min-h-[200px]">
        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500"/>
        <p className="text-gray-600">Este jogo não possui palavras para jogar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg space-y-6">
      <div className="flex items-center justify-between pb-3 border-b-2 border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 tracking-wide">Jogo da Forca</h3>
        <span className="text-sm font-semibold text-white bg-purple-500 px-3 py-1 rounded-full">
            {currentWordIndex + 1} / {words.length}
        </span>
      </div>
      
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />

      {hint && (
        <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-3 rounded-r-lg flex items-center">
          <Lightbulb className="h-5 w-5 mr-3 flex-shrink-0" />
          <p className="text-sm italic">Dica: {hint}</p>
        </div>
      )}

      <div className="flex justify-center flex-wrap gap-2 py-4">
        {originalWord.split("").map((char, index) => {
          if (/[^A-Z]/.test(char)) {
            return <div key={index} className="w-4 h-12 md:h-14 flex items-end justify-center"><span className="text-2xl">{char}</span></div>
          }
          return (
            <div key={index} className="w-10 h-12 md:w-12 md:h-14 bg-gray-200 rounded-md flex items-center justify-center">
              <span className={`text-2xl md:text-3xl font-bold uppercase transition-opacity duration-500 ${guessedLetters.includes(char) || isLoser ? 'opacity-100' : 'opacity-0'}`}
                    style={{ color: !guessedLetters.includes(char) && isLoser ? "#ef4444" : "#1f2937" }}>
                {char}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 justify-center pt-4 border-t-2 border-gray-100">
        {KEYS.map(key => {
          const isGuessed = guessedLetters.includes(key);
          const isCorrect = isGuessed && wordToGuess.includes(key);
          const isIncorrect = isGuessed && !wordToGuess.includes(key);
          return (
            <Button
              onClick={() => addGuessedLetter(key)}
              variant="outline"
              size="icon"
              className={`w-10 h-10 text-lg font-bold transition-all duration-200
                ${isCorrect ? 'bg-green-500 text-white border-green-600' : ''}
                ${isIncorrect ? 'bg-red-500 text-white border-red-600 opacity-60' : ''}
                ${!isGuessed ? 'hover:bg-purple-100 hover:border-purple-400' : ''}
              `}
              disabled={isGuessed || isWinner || isLoser}
              key={key}
            >
              {key}
            </Button>
          )
        })}
      </div>
      
       <div className="text-center font-bold text-xl h-8 transition-all duration-300">
           {isWinner && <p className="text-green-500 animate-pulse">Você acertou! Próxima palavra...</p>}
           {isLoser && !isWinner && <p className="text-red-500">A palavra era: <span className="font-extrabold">{originalWord}</span></p>}
       </div>
    </div>
  );
};

export default HangmanGame;