import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Brain, KeyRound, LogOut, Home, Plus, Trophy } from 'lucide-react';
import HomePage from '@/components/HomePage';
import GameCreator from '@/components/GameCreator';
import GamePlayer from '@/components/GamePlayer';
import Rankings from '@/components/Rankings';
import Auth from '@/components/Auth';
import ChangePassword from '@/components/ChangePassword';

function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [publicGames, setPublicGames] = useState([]);
  const [myGames, setMyGames] = useState([]);
  const [gameResults, setGameResults] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const { toast } = useToast();

  const fetchAllData = useCallback(async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const publicGamesRes = await fetch('http://localhost:3001/api/games');
      if (publicGamesRes.ok) {
        const publicGamesData = await publicGamesRes.json();
        setPublicGames(publicGamesData);
      } else {
        console.error("Falha ao buscar jogos públicos");
      }

      if (token) {
        const myGamesRes = await fetch('http://localhost:3001/api/games/my-games', { headers });
        if (myGamesRes.ok) {
          const myGamesData = await myGamesRes.json();
          setMyGames(myGamesData);
        } else {
          console.error("Falha ao buscar meus jogos (sessão pode ter expirado)");
          setMyGames([]);
        }
      }

      const resultsRes = await fetch('http://localhost:3001/api/results');
      if (resultsRes.ok) {
        const resultsData = await resultsRes.json();
        setGameResults(resultsData);
      } else {
        console.error("Falha ao buscar resultados");
      }

    } catch (error) {
      console.error("Erro de rede ao buscar dados:", error);
      toast({ title: "Erro de Rede", description: "Não foi possível carregar os dados do servidor.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    const initializeApp = async () => {
      const path = window.location.pathname;
      const gameIdMatch = path.match(/^\/jogar\/([a-fA-F0-9]{24})$/);
      const savedPlayer = localStorage.getItem('currentPlayer');
      const token = localStorage.getItem('token');
      const player = savedPlayer ? JSON.parse(savedPlayer) : null;
      
      setCurrentPlayer(player);
      
      if (player && token) {
        await fetchAllData();
      }

      if (gameIdMatch) {
          const gameId = gameIdMatch[1];
          try {
              const res = await fetch(`http://localhost:3001/api/games/${gameId}`);
              if (!res.ok) throw new Error('Jogo não encontrado ou privado.');
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

  const handleSaveGame = async (gameData) => {
    if (!currentPlayer) {
      toast({ title: "Acesso Negado", description: "Faça o login para salvar um jogo.", variant: "destructive" });
      return;
    }

    const token = localStorage.getItem('token');
    const isEditing = !!gameData.id;
    const url = isEditing ? `http://localhost:3001/api/games/${gameData.id}` : 'http://localhost:3001/api/games';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          ...gameData,
          createdBy: currentPlayer.nome,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar o jogo');
      }
      
      await fetchAllData();
      toast({ title: "Sucesso!", description: `O jogo "${gameData.title}" foi salvo.` });
      setCurrentView('home');
      setSelectedGame(null);

    } catch (error) {
      toast({ title: "Erro ao Salvar", description: error.message, variant: "destructive" });
    }
  };

  const handleEditGame = (game) => {
    setSelectedGame(game);
    setCurrentView('create');
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm("Tem certeza que deseja excluir este jogo? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/games/${gameId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir o jogo');
      }

      await fetchAllData();
      toast({ title: "Sucesso!", description: "O jogo foi excluído." });

    } catch (error) {
      toast({ title: "Erro ao Excluir", description: error.message, variant: "destructive" });
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
      score: result.score,
      timeSpent: result.timeSpent,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions,
    };
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/games/${gameId}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(resultData),
      });
      if (!response.ok) throw new Error('Falha ao salvar o resultado.');
      await fetchAllData();
      toast({ title: "Jogo Concluído!", description: `Sua pontuação foi salva.` });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível salvar sua pontuação.", variant: "destructive" });
    }
  };

  const handleAuthSuccess = async (playerData) => {
    setCurrentPlayer(playerData);
    await fetchAllData();
    if (selectedGame) {
      setCurrentView('play');
    } else {
      setCurrentView('home');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentPlayer');
    localStorage.removeItem('token');
    setCurrentPlayer(null);
    setSelectedGame(null);
    setPublicGames([]);
    setMyGames([]);
    setGameResults([]);
    window.history.replaceState({}, '', '/');
    setCurrentView('auth');
    toast({ title: "Até logo!", description: "Você saiu da sua conta." });
  };

  const navigation = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'create', label: 'Criar Jogo', icon: Plus },
    { id: 'rankings', label: 'Rankings', icon: Trophy },
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
                <p className="text-sm text-purple-200">Aprenda brincando, {currentPlayer.nome}!</p>
              </div>
            </div>
            {currentPlayer && (
              <div className="flex items-center space-x-2">
                 <Button variant="ghost" onClick={() => setCurrentView('changePassword')}>
                  <KeyRound className="h-4 w-4 mr-2" /> Alterar Senha
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" /> Sair
                </Button>
              </div>
            )}
          </div>
        </header>

        {currentView !== 'play' && (
          <nav className="bg-white rounded-lg p-3 mb-8 shadow">
            <div className="flex justify-center space-x-2">
              {navigation.map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => {
                      setSelectedGame(null);
                      setCurrentView(item.id);
                    }}
                    variant={currentView === item.id ? "secondary" : "ghost"}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
            </div>
          </nav>
        )}

        <main>
          {currentView === 'home' && (
            <HomePage
              publicGames={publicGames}
              myGames={myGames}
              onPlayGame={handlePlayGame}
              onCreateGame={() => setCurrentView('create')}
              onEditGame={handleEditGame}
              onDeleteGame={handleDeleteGame}
            />
          )}
          {currentView === 'create' && (
            <GameCreator
              onCreateGame={handleSaveGame}
              onCancel={() => {
                setCurrentView('home');
                setSelectedGame(null);
              }}
              gameToEdit={selectedGame}
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
            <Rankings results={gameResults} games={[...publicGames, ...myGames]} />
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