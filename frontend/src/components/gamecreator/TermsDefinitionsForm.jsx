import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const TermsDefinitionsForm = ({ termsAndDefinitions, setTermsAndDefinitions }) => {
  const addPair = () => {
    setTermsAndDefinitions([...termsAndDefinitions, { term: '', definition: '' }]);
  };

  const removePair = (index) => {
    if (termsAndDefinitions.length > 1) {
      setTermsAndDefinitions(termsAndDefinitions.filter((_, i) => i !== index));
    }
  };

  const updatePair = (index, field, value) => {
    const updated = [...termsAndDefinitions];
    updated[index][field] = value;
    setTermsAndDefinitions(updated);
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-medium text-gray-700">
          2. Termos e Definições
        </h3>
        <Button
          onClick={addPair}
          variant="outline"
          size="sm"
          className="text-purple-600 border-purple-300 hover:bg-purple-50 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Adicionar Par
        </Button>
      </div>
      
      {termsAndDefinitions.map((pair, index) => (
        <div key={index} className="border border-gray-200 rounded-md p-3 space-y-2 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">
              Par {index + 1}
            </span>
            {termsAndDefinitions.length > 1 && (
              <Button
                onClick={() => removePair(index)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-100 p-1 h-auto"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">
                Termo
              </label>
              <input
                type="text"
                value={pair.term}
                onChange={(e) => updatePair(index, 'term', e.target.value)}
                placeholder="Ex: HTML"
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">
                Definição
              </label>
              <input
                type="text"
                value={pair.definition}
                onChange={(e) => updatePair(index, 'definition', e.target.value)}
                placeholder="Ex: Linguagem de Marcação"
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      ))}
       <p className="text-xs text-gray-500">Adicione pelo menos 2 pares para o jogo funcionar.</p>
    </div>
  );
};

export default TermsDefinitionsForm;