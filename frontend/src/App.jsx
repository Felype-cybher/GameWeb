// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Play, Plus, Trophy, User, Home, Brain } from 'lucide-react';
import HomePage from '@/components/HomePage';
import GameCreator from '@/components/GameCreator';
import GamePlayer from '@/components/GamePlayer';
import Rankings from '@/components/Rankings';
import Auth from '@/components/Auth';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [games, setGames] = useState([]);
  const [gameResults, setGameResults] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const { toast } = useToast();

  // ALTERAÇÃO 1: Busca os jogos da API ao carregar o app
  useEffect(() => {
    // Função para buscar os jogos da nossa API
    const fetchGames = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/games');
            if (!response.ok) {
                throw new Error('Falha na resposta da rede');
            }
            const data = await response.json();
            setGames(data); // Atualiza o estado com os jogos do banco
        } catch (error) {
            console.error("Erro ao buscar jogos:", error);
            toast({ title: "Erro de Rede", description: "Não foi possível carregar os jogos do servidor.", variant: "destructive" });
        }
    };

    fetchGames(); // Chama a função

    // Lógica para carregar jogador e resultados continua igual por enquanto
    const savedResults = localStorage.getItem('gameResults');
    const savedPlayer = localStorage.getItem('currentPlayer');

    if (savedResults) setGameResults(JSON.parse(savedResults));
    if (savedPlayer) setCurrentPlayer(JSON.parse(savedPlayer));
  }, []);

  // O useEffect que salvava jogos no localStorage foi REMOVIDO.

  // Este useEffect para resultados pode continuar por enquanto
  useEffect(() => {
    localStorage.setItem('gameResults', JSON.stringify(gameResults));
  }, [gameResults]);

  // Este useEffect para o jogador atual está correto
  useEffect(() => {
    if (currentPlayer) {
      localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
    } else {
      localStorage.removeItem('currentPlayer');
      localStorage.removeItem('token');
    }
  }, [currentPlayer]);


  // ALTERAÇÃO 2: Salva o novo jogo via API
  const handleCreateGame = async (gameData) => {
    if (!currentPlayer) {
        toast({ title: "Acesso Negado", description: "Você precisa estar logado para criar um jogo.", variant: "destructive" });
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...gameData,
                createdBy: currentPlayer.name 
            })
        });

        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.message || 'Erro ao salvar o jogo');
        }

        const newGameFromDB = await response.json();
        
        setGames(prevGames => [newGameFromDB, ...prevGames]); 
        
        toast({
            title: "Jogo criado!",
            description: `O jogo "${gameData.title}" foi salvo com sucesso.`
        });
        setCurrentView('home');

    } catch (error) {
        console.error("Erro ao criar jogo:", error);
        toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  // Nenhuma mudança necessária aqui
  const handlePlayGame = (game) => {
    if (!currentPlayer) {
      setSelectedGame(game);
      setCurrentView('auth');
      return;
    }
    setSelectedGame(game);
    setCurrentView('play');
  };
  
  // Nenhuma mudança necessária aqui por enquanto
  const handleGameComplete = (result) => {
    const gameResult = {
      id: Date.now().toString(),
      gameId: selectedGame.id,
      gameTitle: selectedGame.title,
      playerName: currentPlayer.name,
      score: result.score,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions,
      timeSpent: result.timeSpent,
      completedAt: new Date().toISOString()
    };
    
    setGameResults([...gameResults, gameResult]);
    toast({ title: "Jogo Concluído!", description: `Parabéns ${currentPlayer.name}! Você fez ${result.score} pontos.` });
    setCurrentView('home');
    setSelectedGame(null);
  };

  // Nenhuma mudança necessária aqui
  const handleAuthSuccess = (playerData) => {
    setCurrentPlayer(playerData);
    if (selectedGame) {
      setCurrentView('play');
    } else {
      setCurrentView('home');
    }
  };

  const navigation = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'create', label: 'Criar Jogo', icon: Plus },
    { id: 'rankings', label: 'Rankings', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="container mx-auto px-4 py-6">
        <header className="bg-purple-600 text-white rounded-lg p-6 mb-8 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold">Jogos Educativos</h1>
                <p className="text-sm text-purple-200">Aprenda brincando!</p>
              </div>
            </div>
            
            {currentPlayer && (
              <Button variant="ghost" onClick={() => setCurrentPlayer(null)}>
                <User className="h-4 w-4 mr-2" />
                Sair ({currentPlayer.name})
              </Button>
            )}
          </div>
        </header>

        {currentView !== 'play' && currentView !== 'auth' && (
          <nav className="bg-white rounded-lg p-3 mb-8 shadow">
            <div className="flex justify-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    variant={currentView === item.id ? "default" : "ghost"}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-md text-sm ${
                      currentView === item.id 
                        ? 'bg-purple-500 text-white' 
                        : 'text-gray-700 hover:bg-purple-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>
        )}

        <main>
            {currentView === 'home' && (
              <HomePage 
                games={games}
                onPlayGame={handlePlayGame}
                onCreateGame={() => setCurrentView('create')}
                currentPlayer={currentPlayer}
              />
            )}
            
            {currentView === 'create' && (
              <GameCreator 
                onCreateGame={handleCreateGame}
                onCancel={() => setCurrentView('home')}
              />
            )}
            
            {currentView === 'play' && selectedGame && (
              <GamePlayer 
                game={selectedGame}
                player={currentPlayer}
                onGameComplete={handleGameComplete}
                onExit={() => setCurrentView('home')}
              />
            )}
            
            {currentView === 'rankings' && (
              <Rankings 
                results={gameResults}
                games={games}
              />
            )}
            
            {currentView === 'auth' && (
              <Auth 
                onAuthSuccess={handleAuthSuccess}
              />
            )}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;
