import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const WordListForm = ({ wordList, setWordList }) => {
  const addWord = () => {
    setWordList([...wordList, { word: '', hint: '' }]);
  };

  const removeWord = (index) => {
    if (wordList.length > 1) {
      setWordList(wordList.filter((_, i) => i !== index));
    }
  };

  const updateWord = (index, field, value) => {
    const updated = [...wordList];
    updated[index][field] = value;
    setWordList(updated);
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-medium text-gray-700">
          2. Lista de Palavras e Dicas
        </h3>
        <Button
          onClick={addWord}
          variant="outline"
          size="sm"
          type="button"
          className="text-purple-600 border-purple-300 hover:bg-purple-50 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Adicionar Palavra
        </Button>
      </div>
      
      {wordList.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-md p-3 space-y-2 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">
              Palavra {index + 1}
            </span>
            {wordList.length > 1 && (
              <Button
                onClick={() => removeWord(index)}
                variant="ghost"
                size="sm"
                type="button"
                className="text-red-500 hover:bg-red-100 p-1 h-auto"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">
                Palavra
              </label>
              <input
                type="text"
                value={item.word}
                onChange={(e) => updateWord(index, 'word', e.target.value)}
                placeholder="Ex: Girafa"
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">
                Dica
              </label>
              <input
                type="text"
                value={item.hint}
                onChange={(e) => updateWord(index, 'hint', e.target.value)}
                placeholder="Ex: Animal com pescoço longo"
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      ))}
       <p className="text-xs text-gray-500">Adicione pelo menos 1 palavra para o jogo funcionar.</p>
    </div>
  );
};

export default WordListForm;