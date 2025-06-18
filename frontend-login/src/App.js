import React, { useState } from "react";
import LoginCadastro from "./LoginCadastro";
import Jogos from "./Jogos";

function App() {
  const [logado, setLogado] = useState(false);

  return (
    <>
      {logado ? (
        <Jogos />
      ) : (
        <LoginCadastro onLoginSuccess={() => setLogado(true)} />
      )}
    </>
  );
}

export default App;
