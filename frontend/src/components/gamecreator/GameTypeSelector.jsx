import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const GameTypeSelector = ({ onSelectType, onCancel, gameTypeDetails }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Criar Novo Jogo</h2>
        <Button
          onClick={onCancel}
          variant="ghost"
          className="text-gray-600 hover:bg-gray-100 text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-3">
          1. Escolha o tipo de jogo:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(gameTypeDetails).map(([id, { name, description, icon: Icon, color }]) => (
            <button
              key={id}
              onClick={() => onSelectType(id)}
              className="border border-gray-200 rounded-md p-4 text-center hover:shadow-md hover:border-purple-400 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <div className={`${color} p-3 rounded-md w-12 h-12 mx-auto mb-2 flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-md font-semibold text-gray-700 mb-1">
                {name}
              </h4>
              <p className="text-gray-500 text-xs">
                {description}
              </p>
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center">Depois de escolher o tipo, você preencherá os detalhes do jogo.</p>
    </div>
  );
};

export default GameTypeSelector;