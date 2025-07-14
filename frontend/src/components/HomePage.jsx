import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { BrainCircuit, HelpCircle, Link2, Gamepad2, Search, Play, Plus, User, Lock, Share2 } from 'lucide-react';

const GameCard = ({ game, onPlay, onShare }) => {
  const getGameTypeInfo = (type) => {
    switch (type) {
      case 'memory':
        return { label: 'Memória', Icon: BrainCircuit, color: 'text-purple-500', bgColor: 'bg-purple-100' };
      case 'quiz':
        return { label: 'Quiz', Icon: HelpCircle, color: 'text-green-500', bgColor: 'bg-green-100' };
      case 'association':
        return { label: 'Associação', Icon: Link2, color: 'text-blue-500', bgColor: 'bg-blue-100' };
      default:
        return { label: 'Jogo', Icon: Gamepad2, color: 'text-gray-500', bgColor: 'bg-gray-100' };
    }
  };

  const { label, Icon, color, bgColor } = getGameTypeInfo(game.gameType);

  // --- MODIFICAÇÃO AQUI ---
  // Define uma descrição padrão caso a do jogo não exista.
  const defaultDescription = `Um desafio de ${game.gameType === 'memory' ? 'memória' : game.gameType === 'quiz' ? 'conhecimento' : 'associação'} para testar suas habilidades.`;

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-grow pr-2">
            <CardTitle className="text-lg font-semibold text-gray-800 mb-1.5">{game.title}</CardTitle>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color} ${bgColor}`}>
              {label}
            </span>
          </div>
          <div className="flex-shrink-0">
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
        </div>
        <CardDescription className="flex items-center text-xs text-gray-500 pt-3">
          <User className="h-3 w-3 mr-1.5"/>
          Criado por {game.createdBy}
          {!game.isPublic && <Lock className="h-3 w-3 ml-2 text-gray-400" />}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/*
          A linha abaixo foi corrigida para usar 'game.description'.
          A classe 'line-clamp-2' foi removida para exibir o texto completo.
        */}
        <p className="text-sm text-gray-600">
          {game.description || defaultDescription}
        </p>
      </CardContent>
      <CardFooter className="flex-col space-y-2 items-stretch pt-4">
        <Button onClick={() => onPlay(game)} className="w-full bg-purple-600 hover:bg-purple-700">
          <Play className="h-4 w-4 mr-2"/>
          Jogar
        </Button>
        <Button onClick={() => onShare(game._id)} variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar
        </Button>
      </CardFooter>
    </Card>
  );
};

const HomePage = ({ publicGames, myGames, onPlayGame, onCreateGame }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleShare = (gameId) => {
    const link = `${window.location.origin}/jogar/${gameId}`;
    navigator.clipboard.writeText(link).then(() => {
        toast({ title: "Link Copiado!", description: "O link para o jogo foi copiado." });
    }).catch(err => {
        toast({ title: "Erro", description: "Não foi possível copiar o link.", variant: "destructive" });
    });
  };

  const filteredPublicGames = useMemo(() => {
    if (!searchTerm) {
      return publicGames;
    }
    return publicGames.filter(game =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.gameType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [publicGames, searchTerm]);

  return (
    <div className="space-y-8">
      <div>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por título ou tipo de jogo..."
            className="w-full pl-10 pr-4 py-2 text-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-700 mb-4">Jogos Públicos</h2>
        {filteredPublicGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPublicGames.map(game => (
              <GameCard key={game._id} game={game} onPlay={onPlayGame} onShare={handleShare} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
            <BrainCircuit className="mx-auto h-12 w-12 text-gray-400"/>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum Jogo Público Encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">Tente uma busca diferente ou crie você mesmo um jogo novo!</p>
          </div>
        )}
      </div>

      {myGames.length > 0 && (
         <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Meus Jogos</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {myGames.map(game => (
                <GameCard key={game._id} game={game} onPlay={onPlayGame} onShare={handleShare} />
              ))}
            </div>
         </div>
      )}

      {myGames.length === 0 && (
         <div className="text-center py-10 px-6 border-2 border-dashed rounded-lg">
           <h3 className="text-lg font-medium text-gray-900">Você ainda não criou nenhum jogo</h3>
           <p className="mt-1 text-sm text-gray-500">Que tal começar agora?</p>
            <Button onClick={onCreateGame} className="mt-4">
              <Plus className="h-4 w-4 mr-2"/>
              Criar Meu Primeiro Jogo
            </Button>
         </div>
      )}
    </div>
  );
};

export default HomePage;