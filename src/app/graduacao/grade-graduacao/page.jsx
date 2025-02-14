// pages/graduacao.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../componetes/Header/Header";
import Footer from "../../componetes/Footer/Footer";

function Graduacao() {
  const [alunos, setAlunos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [search, setSearch] = useState("");
  const [graduacoes, setGraduacoes] = useState([]);
  const [novoGraduacao, setNovoGraduacao] = useState({
    aluno_id: "",
    nome_aluno: "",
    aulas_assistidas: 0, // Alterado para número
    nivel_atual: "",
    proximo_nivel: "",
    aulas_para_graduar: 0 // Alterado para número
  });
  const router = useRouter();

  const mapaProximosNiveis = {
    "Branca Infantil": "Cinza",
    "Cinza": "Cinza Branca",
    "Cinza Branca": "Cinza Preta",
    "Cinza Preta": "Amarela",
    "Amarela": "Amarela Branca",
    "Amarela Branca": "Amarela Preta",
    "Amarela Preta": "Laranja",
    "Laranja": "Laranja Branca",
    "Laranja Branca": "Laranja Preta",
    "Laranja Preta": "Verde",
    "Verde": "Verde Branca",
    "Verde Branca": "Verde Preta",
    "Verde Preta": "Azul",
    "Branca Adulto": "Azul",
    "Azul": "Roxa",
    "Roxa": "Marrom",
    "Marrom": "Preta",
    "Preta": "Coral",
    "Coral": "Vermelha",
    "Vermelha": "Graduação Máxima"
  };

  const semanasPorAno = 52; // Número de semanas por ano

  useEffect(() => {
    // Carregar alunos
    fetch("http://10.200.200.62:5001/alunos/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar alunos: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setAlunos(data);
        setFiltrados(data);
      })
      .catch((err) => console.error(err));
  
    // Carregar graduações
    fetch("http://10.200.200.62:5001/graduacoes/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar graduações: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => setGraduacoes(data))
      .catch((err) => console.error(err));
  }, []);
  
  useEffect(() => {
    // Atualiza o próximo nível baseado no nível atual do aluno
    if (novoGraduacao.nivel_atual) {
      const proximoNivel = mapaProximosNiveis[novoGraduacao.nivel_atual];
      setNovoGraduacao((prev) => ({
        ...prev,
        proximo_nivel: proximoNivel || "", // Atualiza com o próximo nível, se existir
        aulas_para_graduar: calcularAulasParaGraduar(novoGraduacao.nivel_atual)
      }));
    }
  }, [novoGraduacao.nivel_atual]);

  const calcularAulasParaGraduar = (nivel) => {
    const ehInfantil = nivel.includes("Infantil"); // Verifica se é nível infantil
    if (ehInfantil) {
      return semanasPorAno * 2; // 2 aulas por semana para alunos infantis
    } else {
      return semanasPorAno * 3; // 3 aulas por semana para alunos adultos
    }
  };



  const handleSearchChange = (e) => {
    const valorBusca = e.target.value;
    setSearch(valorBusca);

    const alunosFiltrados = alunos.filter((aluno) =>
      aluno.nome.toLowerCase().startsWith(valorBusca.toLowerCase())
    );
    setFiltrados(alunosFiltrados);
  };

  const handleAlunoSelect = (aluno) => {
    setNovoGraduacao({
      ...novoGraduacao,
      aluno_id: aluno.aluno_id,
      nome_aluno: aluno.nome,
      nivel_atual: aluno.faixa_atual || ""
    });

    setSearch(aluno.nome);
    setFiltrados([]);

    fetch(`http://10.200.200.62:5001/presencas/${aluno.aluno_id}/mes?mes=02&ano=2025`)
      .then((response) => response.json())
      .then((data) => {
        const totalAulas = Array.isArray(data) ? data.length : 0;
        setNovoGraduacao((prev) => ({
          ...prev,
          aulas_assistidas: totalAulas
        }));
      })
      .catch((err) => console.error("Erro ao carregar presenças:", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://10.200.200.62:5001/graduacoes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aluno_id: novoGraduacao.aluno_id,
        aulas_assistidas: Number(novoGraduacao.aulas_assistidas),
        nivel_atual: novoGraduacao.nivel_atual,
        proximo_nivel: novoGraduacao.proximo_nivel,
        aulas_para_graduar: Number(novoGraduacao.aulas_para_graduar)
      }),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Graduação registrada com sucesso!");
        setNovoGraduacao({
          aluno_id: "",
          nome_aluno: "",
          aulas_assistidas: "",
          nivel_atual: "",
          proximo_nivel: "",
          aulas_para_graduar: ""
        });
        setSearch("");
        router.push(`/graduacao/graduacao-aluno?aluno_id=${novoGraduacao.aluno_id}`);
      })
      .catch((err) => console.error("Erro ao registrar graduação:", err));
  };

    // Atualizando o valor de aulas_para_graduar considerando as aulas assistidas
    useEffect(() => {
      if (novoGraduacao.aulas_assistidas > 0 && novoGraduacao.aulas_para_graduar > 0) {
        setNovoGraduacao((prev) => ({
          ...prev,
          aulas_para_graduar: prev.aulas_para_graduar - prev.aulas_assistidas
        }));
      }
    }, [novoGraduacao.aulas_assistidas]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto my-4 p-4">
        <h2 className="text-2xl font-bold mb-4">Registrar Graduação</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-500 mb-1 ">Aluno</label>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Filtrar por nome"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none "
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

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-500 mb-1">Aulas Assistidas</label>
            <input
              placeholder="Aulas Assistidas"
              type="text"
              value={novoGraduacao.aulas_assistidas}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 text-gray-500 rounded focus:border-blue-500 focus:outline-none"
            />
          </div>



          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-500 mb-1">Nível Atual</label>
            <input
              type="text"
              value={novoGraduacao.nivel_atual}
              onChange={(e) =>
                setNovoGraduacao({
                  ...novoGraduacao,
                  nivel_atual: e.target.value,
                })
              }
              required
              placeholder="Digite o nível atual"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-500 mb-1">Próximo Nível</label>
            <input
              type="text"
              value={novoGraduacao.proximo_nivel}
              onChange={(e) =>
                setNovoGraduacao({
                  ...novoGraduacao,
                  proximo_nivel: e.target.value,
                })
              }
              required
              placeholder="Próximo Nível"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-500 mb-1">Aulas para Graduar</label>
            <input
              type="text"
              value={novoGraduacao.aulas_para_graduar}
              readOnly
              placeholder="Aulas para graduar"
              className="w-full px-4 py-2 border border-gray-300 text-gray-500 rounded focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex space-x-4">
            {/* <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Registrar
            </button>
            <button
              type="button"
              onClick={() => {
                if (novoGraduacao.aluno_id) {
                  router.push(`/graduacao/graduacao-aluno?aluno_id=${novoGraduacao.aluno_id}`);
                }
              }}
              disabled={!novoGraduacao.aluno_id}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Ver Graduações do Aluno
            </button> */}
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default Graduacao;

