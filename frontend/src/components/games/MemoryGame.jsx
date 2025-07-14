import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, AlertTriangle, Eye, CheckCircle } from 'lucide-react';

const MemoryGame = ({ gameData, onCorrectAnswer, onWrongAnswer, onGameEnd, setTotalQuestions }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairIds, setMatchedPairIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(true);
  const [previewCountdown, setPreviewCountdown] = useState(10);

  const initializeGame = useCallback(() => {
    const pairs = gameData.termsAndDefinitions || [];
    setTotalQuestions(pairs.length);
    
    const gameCards = [];
    pairs.forEach((pair, index) => {
      gameCards.push({ id: `term-${index}`, content: pair.term, type: 'term', pairId: index });
      gameCards.push({ id: `def-${index}`, content: pair.definition, type: 'definition', pairId: index });
    });
    
    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedPairIds([]);
    setMoves(0);
    setIsChecking(false);
    setIsPreviewing(true);
    setPreviewCountdown(10);
  }, [gameData, setTotalQuestions]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  
  useEffect(() => {
    if (isPreviewing) {
      if (previewCountdown > 0) {
        const timer = setTimeout(() => {
          setPreviewCountdown(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setIsPreviewing(false);
      }
    }
  }, [isPreviewing, previewCountdown]);


  const handleCardClick = (clickedCard) => {
    if (isPreviewing || isChecking || flippedCards.includes(clickedCard.id) || matchedPairIds.includes(clickedCard.pairId)) {
      return;
    }
    
    const newFlippedCards = [...flippedCards, clickedCard.id];
    setFlippedCards(newFlippedCards);
    
    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves(prev => prev + 1);
      
      const firstCard = cards.find(c => c.id === newFlippedCards[0]);
      const secondCard = cards.find(c => c.id === newFlippedCards[1]);

      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        onCorrectAnswer(20);
        
        // --- ALTERADO: Atraso de 1 segundo antes de marcar como "encontrado" ---
        setTimeout(() => {
          setMatchedPairIds(prev => {
            const newMatched = [...prev, firstCard.pairId];
            if (newMatched.length === (gameData.termsAndDefinitions?.length || 0)) {
              onGameEnd(newMatched.length * 20, newMatched.length, gameData.termsAndDefinitions.length);
            }
            return newMatched;
          });
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000); // 1 segundo de pausa

      } else {
        onWrongAnswer();
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    initializeGame();
  };

  const isCardFlipped = (card) => isPreviewing || flippedCards.includes(card.id) || matchedPairIds.includes(card.pairId);
  const isCardMatched = (card) => matchedPairIds.includes(card.pairId);

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg space-y-4 relative">
      {isPreviewing && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg z-20">
          <Eye className="text-white h-16 w-16 mb-4 animate-pulse" />
          <p className="text-white text-2xl font-bold">Prepare-se!</p>
          <p className="text-white text-lg">Memorize as cartas em...</p>
          <p className="text-white text-6xl font-mono font-bold">{previewCountdown}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between pb-3 border-b">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Jogo da Memória</h3>
          <p className="text-sm text-gray-500">Clique nas cartas para encontrar os pares.</p>
        </div>
        <div className="flex items-center space-x-4 mt-3 sm:mt-0">
          <div className="text-center">
            <div className="text-xs text-gray-600">TENTATIVAS</div>
            <div className="text-2xl font-bold text-purple-600">{moves}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600">ACERTOS</div>
            <div className="text-2xl font-bold text-purple-600">{matchedPairIds.length} / {gameData.termsAndDefinitions?.length || 0}</div>
          </div>
          <Button onClick={resetGame} variant="outline" size="icon" className="h-10 w-10">
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {cards.length === 0 && gameData.termsAndDefinitions?.length > 0 && (
          <p className="text-sm text-center text-gray-500 py-4">Carregando cartas...</p>
      )}

      {gameData.termsAndDefinitions?.length < 2 && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded text-center flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 mr-2"/>
          <p className="text-sm">Este jogo precisa de pelo menos 2 pares de termos/definições.</p>
          </div>
      )}

      {cards.length > 0 && gameData.termsAndDefinitions?.length >=2 && (
        <div className={`grid gap-2 md:gap-3 ${cards.length > 12 ? 'grid-cols-5' : 'grid-cols-4'}`}>
          {cards.map((card) => {
            const isFlipped = isCardFlipped(card);
            const isMatched = isCardMatched(card);

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                disabled={isChecking || isMatched}
                className={`
                  w-full aspect-square rounded-lg border-2 transition-all duration-300 transform-gpu
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                  ${isFlipped && !isMatched ? 'bg-purple-100 border-purple-400' : 'bg-gray-300 hover:bg-gray-400 border-gray-400'}
                  ${isMatched ? 'bg-green-100 border-green-300 cursor-default' : 'cursor-pointer'}
                `}
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}
              >
                {/* Verso da Carta (Conteúdo) */}
                <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs md:text-sm font-medium text-purple-800" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <span>{card.content}</span>
                </div>
                
                {/* Frente da Carta (?) */}
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold" style={{ backfaceVisibility: 'hidden' }}>
                  {isMatched ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : (
                    <span className="text-gray-500">?</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default MemoryGame;