"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../componetes/Header/Header";  // Ajuste o caminho conforme sua estrutura
import Footer from "../componetes/Footer/Footer";

function Alunos() {
  const [novoAluno, setNovoAluno] = useState({
    nome: "",
    email: "",
    telefone: "",
    contrato: "",
    faixa_atual: ""
  });
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/alunos/aluno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoAluno)
    })
      .then((response) => response.json())
      .then((data) => {
        // Limpa o formulário após o sucesso
        setNovoAluno({
          nome: "",
          email: "",
          telefone: "",
          contrato: "",
          faixa_atual: ""
        });
      })
      .catch((err) => console.error("Erro ao adicionar aluno:", err));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto my-4 p-4 bg-transparent">
        <h2 className="text-2xl text-center mb-5 font-semibold">Adicionar Novo Aluno</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nome"
              value={novoAluno.nome}
              onChange={(e) =>
                setNovoAluno({ ...novoAluno, nome: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"

            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={novoAluno.email}
              onChange={(e) =>
                setNovoAluno({ ...novoAluno, email: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"

            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Telefone"
              value={novoAluno.telefone}
              onChange={(e) =>
                setNovoAluno({ ...novoAluno, telefone: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"

            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Mátricula"
              value={novoAluno.contrato}
              onChange={(e) =>
                setNovoAluno({ ...novoAluno, contrato: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"

            />
          </div>
          <div>
           
            <select
              value={novoAluno.faixa_atual}
              onChange={(e) =>
                setNovoAluno({ ...novoAluno, faixa_atual: e.target.value })
              }
              required
              className="w-full px-4 py-2 focus:border-blue-500 focus:outline-none text-gray-400 border border-gray-300 rounded-lg appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22%23666%22 viewBox=%220 0 20 20%22%3E%3Cpath d=%22M5.516 7.548a.625.625 0 0 1 .884-.022L10 10.828l3.6-3.302a.625.625 0 1 1 .84.932l-4.02 3.69a.625.625 0 0 1-.84 0l-4.02-3.69a.625.625 0 0 1-.022-.884z%22/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-[length:1.25rem]"
            >
              <option value="">Selecione a faixa atual</option>
              <option value="branca">Branca Infantil</option>
              <option value="cinza">Cinza</option>
              <option value="cinza-branca">Cinza Branca</option>
              <option value="cinza-preta">Cinza Preta</option>
              <option value="amarela">Amarela</option>
              <option value="amarela-branca">Amarela Branca</option>
              <option value="amarela-preta">Amarela Preta</option>
              <option value="laranja">Laranja</option>
              <option value="laranja-branca">Laranja Branca</option>
              <option value="laranja-preta">Laranja Preta</option>
              <option value="verde">Verde</option>
              <option value="verde-branca">Verde Branca</option>
              <option value="verde-preta">Verde Preta</option>
              <option value="branca-adulto">Branca Adulto</option>
              <option value="azul">Azul</option>
              <option value="roxa">Roxa</option>
              <option value="marrom">Marrom</option>
              <option value="preta">Preta</option>
              <option value="coral">Coral</option>
              <option value="vermelha">Vermelha</option>
            </select>

          </div>
          <button type="submit" className="w-40 py-2 bg-blue-500 text-white rounded-lg">
            Adicionar
          </button>
        </form>
        <button
          onClick={() => router.push("/alunos/listar-alunos")}
          className="mt-4 py-2 px-3 bg-gray-500 text-white rounded-lg"
        >
          Ver Lista de Alunos
        </button>
      </main>

      <Footer />
    </div>
  );
}

export default Alunos;
