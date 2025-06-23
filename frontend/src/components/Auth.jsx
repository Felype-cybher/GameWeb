    import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';

    function Auth({ onAuthSuccess }) {
      const [form, setForm] = useState('login');
      const [dados, setDados] = useState({ nome: '', email: '', senha: '' });
      const [mensagem, setMensagem] = useState('');
      const { toast } = useToast();

      const handleChange = (e) => {
        setDados({ ...dados, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem('Processando...');

        const isCadastro = form === 'cadastro';
        const endpoint = isCadastro ? 'cadastro' : 'login';
        const url = `http://localhost:3001/auth/${isCadastro ? 'register' : 'login'}`;

        const corpo = isCadastro
          ? { nome: dados.nome, email: dados.email, senha: dados.senha }
          : { email: dados.email, senha: dados.senha };

        try {
          const resposta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(corpo),
          });

          const resultado = await resposta.json();

          if (!resposta.ok) {
            setMensagem(resultado.mensagem);
            toast({ title: 'Erro', description: resultado.mensagem, variant: 'destructive' });
            return;
          }
          
          toast({ title: 'Sucesso!', description: resultado.mensagem });
          
          let playerData;
          if (isCadastro) {
            // No cadastro, usamos os dados do formulário para o callback imediato
            // e pedimos para o usuário fazer login para obter o token.
            setMensagem("Cadastro realizado! Faça o login para continuar.");
            setForm('login'); // Muda para a tela de login
          } else {
            // No login, o backend retorna o usuário e o token
            playerData = resultado.usuario; 
            localStorage.setItem('token', resultado.token);
            localStorage.setItem('currentPlayer', JSON.stringify(playerData));
            onAuthSuccess(playerData); // Chama a função do App.jsx
          }

        } catch (erro) {
          console.error("Erro:", erro);
          setMensagem("Erro de conexão com o servidor.");
          toast({ title: "Erro de Conexão", description: 'Não foi possível conectar ao servidor.', variant: "destructive" });
        }
      };

      return (
        <div className="bg-white rounded-lg p-6 shadow-md max-w-sm mx-auto">
          <h1 className="text-2xl font-semibold text-center mb-4">
            {form === 'cadastro' ? 'Criar Conta' : 'Fazer Login'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {form === 'cadastro' && (
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={dados.nome}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={dados.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={dados.senha}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              {form === 'cadastro' ? 'Cadastrar' : 'Entrar'}
            </Button>
          </form>

          {mensagem && <p className="text-center text-red-500 mt-3">{mensagem}</p>}

          <Button
            variant="link"
            onClick={() => setForm(form === 'cadastro' ? 'login' : 'cadastro')}
            className="w-full mt-2"
          >
            {form === 'cadastro' ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
          </Button>
        </div>
      );
    }

    export default Auth;
    