import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';

const DragDropGame = ({ gameData, onCorrectAnswer, onWrongAnswer, onGameEnd, setTotalQuestions }) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeGame();
  }, [gameData]);

  const initializeGame = () => {
    const gameItems = gameData.itemsAndCategories?.items || [];
    const gameCategories = gameData.itemsAndCategories?.categories || [];
    
    setTotalQuestions(gameItems.length);
    
    const shuffledItems = gameItems
      .map((item, index) => ({
        ...item,
        id: `item-${index}`,
        isPlaced: false, 
      }))
      .sort(() => Math.random() - 0.5);
    
    const categoriesWithSlots = gameCategories.map(categoryName => ({
      name: categoryName,
      itemsInZone: [], 
      id: `category-${categoryName}`
    }));
    
    setItems(shuffledItems);
    setCategories(categoriesWithSlots);
    setGameCompleted(false);
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', item.id); // Necessário para Firefox
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetCategoryName) => {
    e.preventDefault();
    if (!draggedItem) return;

    const isCorrect = draggedItem.category === targetCategoryName;

    if (isCorrect) {
      setItems(prevItems => prevItems.map(item => 
        item.id === draggedItem.id ? { ...item, isPlaced: true } : item
      ));
      setCategories(prevCategories => prevCategories.map(cat => 
        cat.name === targetCategoryName 
          ? { ...cat, itemsInZone: [...cat.itemsInZone, draggedItem] } 
          : cat
      ));
      onCorrectAnswer(10);
      toast({ title: "Certo!", description: `${draggedItem.name} na categoria ${targetCategoryName}.` });

      const allPlaced = items.every(item => item.id === draggedItem.id || item.isPlaced);
      if (allPlaced) {
        setGameCompleted(true);
        const totalCorrect = items.filter(i => i.category === categories.find(c => c.itemsInZone.some(cz => cz.id === i.id))?.name).length;
        onGameEnd(totalCorrect * 10, totalCorrect, items.length);
      }
    } else {
      onWrongAnswer();
      toast({ title: "Errado!", description: `${draggedItem.name} não vai em ${targetCategoryName}.`, variant: "destructive" });
    }
    setDraggedItem(null);
  };

  const resetGame = () => {
    initializeGame();
  };

  const unplacedItems = items.filter(item => !item.isPlaced);
  const placedItemsCount = items.length - unplacedItems.length;
  const progress = items.length > 0 ? (placedItemsCount / items.length) * 100 : 0;

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between pb-3 border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Arrastar e Soltar</h3>
          <p className="text-xs text-gray-500">Coloque os itens nas categorias certas.</p>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <div className="text-xs text-gray-600">
            Progresso: {placedItemsCount}/{items.length}
          </div>
          <Button onClick={resetGame} variant="outline" size="sm" className="text-xs p-1 h-auto">
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 border border-gray-200 rounded-md p-3 bg-gray-50 min-h-[150px]">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Itens para arrastar:</h4>
          {unplacedItems.length > 0 ? (
            <div className="space-y-2">
              {unplacedItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="bg-white border border-gray-300 rounded-md p-2 text-xs text-gray-700 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md"
                >
                  {item.name}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-4">Todos os itens foram colocados!</p>
          )}
        </div>
        
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, category.name)}
              className="border-2 border-dashed border-gray-300 rounded-md p-3 min-h-[120px] bg-white hover:border-purple-400 transition-colors"
            >
              <h5 className="text-sm font-medium text-gray-700 mb-2 text-center">
                {category.name}
              </h5>
              <div className="space-y-1">
                {category.itemsInZone.map((item) => (
                  <div key={item.id} className="bg-green-100 border border-green-300 rounded p-1.5 text-xs text-green-700 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                    {item.name}
                  </div>
                ))}
              </div>
              {category.itemsInZone.length === 0 && (
                 <p className="text-xs text-gray-400 text-center pt-4">Arraste aqui</p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {gameCompleted && (
        <div className="mt-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded text-center">
          <h4 className="text-md font-semibold">Parabéns! Jogo Concluído!</h4>
        </div>
      )}
       {items.length === 0 && (
        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded text-center flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 mr-2"/>
          <p className="text-sm">Este jogo não tem itens ou categorias configurados.</p>
        </div>
      )}
    </div>
  );
};

export default DragDropGame;