import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RotateCcw, AlertTriangle } from 'lucide-react';

const MemoryGame = ({ gameData, onCorrectAnswer, onWrongAnswer, onGameEnd, setTotalQuestions }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); // Armazena IDs das cartas viradas
  const [matchedPairIds, setMatchedPairIds] = useState([]); // Armazena pairIds dos pares encontrados
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeGame();
  }, [gameData]);

  const initializeGame = () => {
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
  };

  const handleCardClick = (clickedCard) => {
    if (isChecking || flippedCards.includes(clickedCard.id) || matchedPairIds.includes(clickedCard.pairId)) {
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
        setMatchedPairIds(prev => [...prev, firstCard.pairId]);
        onCorrectAnswer(20);
        toast({ title: "Par!", description: "Você encontrou um par!" });
        setFlippedCards([]);
        setIsChecking(false);
        if (matchedPairIds.length + 1 === (gameData.termsAndDefinitions?.length || 0)) {
          onGameEnd((matchedPairIds.length + 1) * 20, matchedPairIds.length + 1, gameData.termsAndDefinitions.length);
        }
      } else {
        onWrongAnswer();
        toast({ title: "Ops!", description: "Não é um par.", variant: "destructive" });
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

  const isCardFlipped = (card) => flippedCards.includes(card.id) || matchedPairIds.includes(card.pairId);

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between pb-3 border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Jogo da Memória</h3>
          <p className="text-xs text-gray-500">Encontre os pares.</p>
        </div>
        <div className="flex items-center space-x-3 mt-2 sm:mt-0 text-xs">
          <div className="text-gray-600">Movimentos: <span className="font-semibold">{moves}</span></div>
          <div className="text-gray-600">Pares: <span className="font-semibold">{matchedPairIds.length}/{gameData.termsAndDefinitions?.length || 0}</span></div>
          <Button onClick={resetGame} variant="outline" size="sm" className="text-xs p-1 h-auto">
            <RotateCcw className="h-3 w-3" />
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
        <div className={`grid gap-2 md:gap-3 ${cards.length > 8 ? 'grid-cols-4' : 'grid-cols-3'} sm:grid-cols-${Math.min(cards.length / 2, 6)}`}>
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={isChecking || matchedPairIds.includes(card.pairId)}
              className={`aspect-square rounded-md border-2 transition-all duration-300 transform 
                ${isCardFlipped(card) ? 'bg-purple-200 border-purple-400 rotate-y-180' : 'bg-gray-300 hover:bg-gray-400 border-gray-400'}
                ${matchedPairIds.includes(card.pairId) ? 'opacity-50 cursor-default' : 'cursor-pointer'}
                focus:outline-none focus:ring-2 focus:ring-purple-500
              `}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className={`w-full h-full flex items-center justify-center p-1 text-center text-xs md:text-sm font-medium 
                ${isCardFlipped(card) ? 'text-purple-700 rotate-y-180' : 'text-transparent'}`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                {isCardFlipped(card) ? card.content : '?'}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryGame;