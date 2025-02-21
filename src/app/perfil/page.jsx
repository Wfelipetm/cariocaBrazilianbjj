"use client";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider"; // Verifique o caminho correto para o contexto

export default function Perfil() {
  const { user, logout } = useContext(AuthContext); // Consome o logout do contexto
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  // Função para extrair as iniciais do nome
  const getIniciais = (name) => {
    if (!name) return "";
    const partes = name.trim().split(" ");
    return partes.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
  };

  // Atualiza os estados com os dados do usuário ao carregar
  useEffect(() => {
    if (user) {
      setNome(user.nome || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para atualizar os dados do perfil
    console.log("Dados atualizados:", { nome, email });
  };

  return (
    <section className="flex flex-col items-center justify-center h-full p-4 lg:ml-[800px] sm:ml-[100px]">
      <h2 className="text-xl font-bold mb-4">Perfil do Usuário</h2>

      {/* Avatar aumentado */}
      <div className="mb-16">
        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-4xl font-bold text-white">
          {getIniciais(nome)}
        </div>
      </div>

      {/* Formulário para editar os dados */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm mb-4">
        <div className="mb-4">
          <label htmlFor="nome" className="block text-gray-400 font-bold mb-2">
            Nome
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-400 font-bold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Botões lado a lado */}
        <div className="flex gap-4 mt-5">
          <button
            type="submit"
            className="flex-1 lg:h-12 lg:w-96 sm:h-14 sm:w-80 bg-blue-500 text-white rounded"
          >
            Atualizar Perfil
          </button>
          <button
            type="button"
            onClick={logout} // Chama a função logout do contexto diretamente
            className="flex-1 py-2 bg-red-500 text-white rounded"
          >
            Sair
          </button>
        </div>
      </form>
    </section>
  );
}
