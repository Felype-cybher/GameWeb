import React, { useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState("cadastro"); // Alterna entre "cadastro" e "login"
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    senha: ""
  });
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = form === "cadastro" ? "cadastro" : "login";
    const corpo = form === "cadastro"
      ? { nome: dados.nome, email: dados.email, senha: dados.senha }
      : { email: dados.email, senha: dados.senha };

    try {
      const resposta = await fetch(`http://localhost:3001/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
      });

      const resultado = await resposta.json();
      setMensagem(resultado.mensagem);
    } catch (erro) {
      console.error("Erro:", erro);
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="App">
      <h1>{form === "cadastro" ? "Cadastro" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        {form === "cadastro" && (
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={dados.nome}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={dados.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={dados.senha}
          onChange={handleChange}
          required
        />
        <button type="submit">{form === "cadastro" ? "Cadastrar" : "Entrar"}</button>
      </form>

      <p>{mensagem}</p>

      <button onClick={() => setForm(form === "cadastro" ? "login" : "cadastro")}>
        {form === "cadastro" ? "Ir para Login" : "Ir para Cadastro"}
      </button>
    </div>
  );
}

export default App;
