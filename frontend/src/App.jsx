// frontend/src/App.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Play, Plus, Trophy, User, Home, Brain, KeyRound } from 'lucide-react';
import HomePage from '@/components/HomePage';
import GameCreator from '@/components/GameCreator';
import GamePlayer from '@/components/GamePlayer';
import Rankings from '@/components/Rankings';
import Auth from '@/components/Auth';
import ChangePassword from '@/components/ChangePassword';

function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [games, setGames] = useState([]);
  const [gameResults, setGameResults] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const { toast } = useToast();

  const fetchAllData = useCallback(async () => {
    try {
      const [gamesRes, resultsRes] = await Promise.all([
        fetch('http://localhost:3001/api/games'),
        fetch('http://localhost:3001/api/results')
      ]);
      const gamesData = await gamesRes.json();
      const resultsData = await resultsRes.json();
      setGames(gamesData);
      setGameResults(resultsData);
    } catch (error) {
      console.error("Erro ao buscar dados iniciais:", error);
    }
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      const path = window.location.pathname;
      const gameIdMatch = path.match(/^\/jogar\/([a-fA-F0-9]{24})$/);

      await fetchAllData();

      const savedPlayer = localStorage.getItem('currentPlayer');
      const token = localStorage.getItem('token');
      const player = savedPlayer ? JSON.parse(savedPlayer) : null;
      
      setCurrentPlayer(player);

      if (gameIdMatch) {
          const gameId = gameIdMatch[1];
          try {
              const res = await fetch(`http://localhost:3001/api/games/${gameId}`);
              if (!res.ok) throw new Error('Jogo não encontrado');
              const gameFromUrl = await res.json();
              
              setSelectedGame(gameFromUrl);
              setCurrentView(player && token ? 'play' : 'auth'); 
          } catch (error) {
              toast({ title: "Erro", description: "O link do jogo é inválido ou foi removido.", variant: "destructive" });
              window.history.replaceState({}, '', '/');
              setCurrentView(player && token ? 'home' : 'auth');
          }
      } else {
          setCurrentView(player && token ? 'home' : 'auth');
      }
    };
    initializeApp();
  }, [toast, fetchAllData]);

  const handleCreateGame = async (gameData) => {
    if (!currentPlayer) {
      toast({ title: "Acesso Negado", description: "Faça o login para criar um jogo.", variant: "destructive" });
      setCurrentView('auth');
      return;
    }
    const createdBy = currentPlayer.nome || 'Anônimo';
    try {
      const response = await fetch('http://localhost:3001/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...gameData, createdBy })
      });
      if (!response.ok) throw new Error('Erro ao salvar o jogo');
      const newGameFromDB = await response.json();
      setGames(prevGames => [newGameFromDB, ...prevGames]);
      toast({ title: "Jogo criado!", description: `O jogo "${gameData.title}" foi salvo.` });
      setCurrentView('home');
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const handlePlayGame = (game) => {
    if (!currentPlayer) {
      setCurrentView('auth');
      return;
    }
    setSelectedGame(game);
    setCurrentView('play');
  };

  const handleGameComplete = async (result) => {
    const gameId = selectedGame._id;
    const resultData = {
      playerName: currentPlayer.nome,
      score: result.score,
      timeSpent: result.timeSpent,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions,
    };
    try {
      const response = await fetch(`http://localhost:3001/api/games/${gameId}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData),
      });
      if (!response.ok) throw new Error('Falha ao salvar o resultado.');
      const resultsRes = await fetch('http://localhost:3001/api/results');
      const updatedResults = await resultsRes.json();
      setGameResults(updatedResults);
      toast({ title: "Jogo Concluído!", description: `Sua pontuação foi salva.` });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível salvar sua pontuação.", variant: "destructive" });
    }
  };

  const handleAuthSuccess = (playerData) => {
    setCurrentPlayer(playerData);
    if (selectedGame) {
      setCurrentView('play');
    } else {
      setCurrentView('home');
    }
  };
  
  const handleLogout = () => {
    setCurrentPlayer(null);
    setSelectedGame(null);
    window.history.replaceState({}, '', '/');
    setCurrentView('auth');
    toast({ title: "Até logo!", description: "Você saiu da sua conta." });
  };

  const navigation = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'create', label: 'Criar Jogo', icon: Plus },
    { id: 'rankings', label: 'Rankings', icon: Trophy },
    { id: 'changePassword', label: 'Alterar Senha', icon: KeyRound },
  ];
  
  if (currentView === 'loading') {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center">Carregando...</div>;
  }
  
  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <Auth onAuthSuccess={handleAuthSuccess} /> <Toaster />
      </div>
    );
  }

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
              <Button variant="ghost" onClick={handleLogout}>
                <User className="h-4 w-4 mr-2" /> Sair ({currentPlayer.nome})
              </Button>
            )}
          </div>
        </header>

        {currentView !== 'play' && (
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
                    <Icon className="h-4 w-4" /> <span>{item.label}</span>
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
              onExit={() => {
                  window.history.replaceState({}, '', '/');
                  setSelectedGame(null);
                  setCurrentView('home');
              }}
            />
          )}
          {currentView === 'rankings' && (
            <Rankings results={gameResults} games={games} />
          )}
          {currentView === 'changePassword' && (
            <ChangePassword 
              onPasswordChanged={() => setCurrentView('home')}
              onCancel={() => setCurrentView('home')}
            />
          )}
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
