"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from '../../componetes/Header/Header';  // Caminho para o Header
import Footer from '../../componetes/Footer/Footer';

function Presencas() {
  const [alunos, setAlunos] = useState([]); // Lista de alunos
  const [filtrados, setFiltrados] = useState([]); // Alunos filtrados
  const [novoPresenca, setNovoPresenca] = useState({
    aluno_id: "",
    data_checkin: "",
    nome_aluno: ""
  });
  const [search, setSearch] = useState(""); // Valor do campo de busca
  const router = useRouter();

  useEffect(() => {
    // Carregar a lista de alunos
    fetch("http://10.200.200.62:5001/alunos/")
      .then((response) => response.json())
      .then((data) => {
        setAlunos(data);
        setFiltrados(data); // Inicialmente, todos os alunos são visíveis
      })
      .catch((err) => console.error("Erro ao carregar alunos:", err));

    // Definir a data atual no formato 'YYYY-MM-DD'
    const dataAtual = new Date().toISOString().split("T")[0];
    setNovoPresenca((prevState) => ({
      ...prevState,
      data_checkin: dataAtual
    }));
  }, []);

  const handleSearchChange = (e) => {
    const valorBusca = e.target.value;
    setSearch(valorBusca);

    // Filtra os alunos que começam com a letra digitada
    const pontosFiltrados = pontos.filter((ponto) =>
      ponto.nome.toLowerCase().startsWith(valorBusca.toLowerCase())
    );

    setFiltrados(alunosFiltrados); // Atualiza os alunos filtrados
  };

  const handleAlunoSelect = (aluno) => {
    setNovoPresenca({
      ...novoPresenca,
      aluno_id: aluno.aluno_id,
      nome_aluno: aluno.nome
    });
    setSearch(aluno.nome); // Atualiza o campo de busca com o nome do aluno selecionado
    setFiltrados([]); // Limpa a lista de filtrados após a seleção
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Requisição POST para registrar a presença
    fetch("http://10.200.200.62:5001/presencas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aluno_id: novoPresenca.aluno_id,
        data_checkin: novoPresenca.data_checkin,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Presença registrada com sucesso!");
  
        
        // Limpar os dados do estado após o sucesso
        setNovoPresenca({
          aluno_id: "",
          data_checkin: "", // Agora está vazio
          nome_aluno: "",
        });
        setSearch(""); // Limpar o campo de busca
        setFiltrados(alunos); // Restaurar a lista de alunos
  
        // Navegar para a página de presenças do aluno
        router.push(`/presenca/presencaspormes?aluno_id=${novoPresenca.aluno_id}`);
      })
      .catch((err) => console.error("Erro ao registrar presença:", err));
  };
  

  return (
    <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto my-4 p-4">
      <h2 className="text-2xl text-center font-bold mb-4">Registrar Presença</h2>
      <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo de busca/seleção do aluno */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            
          </label>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Digite para filtrar"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
          {filtrados.length > 0 && search && (
            <ul className="max-h-40 overflow-y-auto mt-1 border border-gray-300 p-0 ">
              {filtrados.map((aluno) => (
                <li
                  key={aluno.aluno_id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleAlunoSelect(aluno)}
                >
                  {aluno.nome}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Campo de data */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1 ">
        
          </label>
          <input
            type="date"
            value={novoPresenca.data_checkin}
            onChange={(e) =>
              setNovoPresenca({ ...novoPresenca, data_checkin: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Botões */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Registrar
          </button>
          <button
            type="button"
            onClick={() =>
              router.push(`/presenca/presencaspormes?aluno_id=${novoPresenca.aluno_id}`)
            }
            disabled={!novoPresenca.aluno_id}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Ver Presenças do Aluno
          </button>
        </div>
      </form>
      </div>
      </main>
      <Footer />
    </div>
  );
}

export default Presencas;
