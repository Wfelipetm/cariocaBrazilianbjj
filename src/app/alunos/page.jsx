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
    matricula: "",
    faixa_atual: "",
    data_pagamento:"",
    professor:"",
    turma:""
  });
  console.log(JSON.stringify(novoAluno, null, 2));

  const router = useRouter();
 // Função para gerar um número de matrícula com 5 dígitos
 const gerarMatricula = () => {
  return Math.floor(10000 + Math.random() * 90000); // Gera um número entre 10000 e 99999
};

useEffect(() => {
  // Preencher a matrícula automaticamente quando o componente for montado
  setNovoAluno((prevState) => ({
    ...prevState,
    matricula: gerarMatricula() // Atribui o número de matrícula gerado
  }));
}, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://10.200.200.62:5001/alunos/criar_aluno", {
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
          matricula: "",
          faixa_atual: "",
          data_pagamento:"",
          professor:"",
          turma:""
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
              value={novoAluno.matricula}
              onChange={(e) =>
                setNovoAluno({ ...novoAluno, matricula: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"

            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Data pagamento"
              value={novoAluno.data_pagamento}
              onChange={(e) =>
                setNovoAluno({ ...novoAluno, data_pagamento: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"

            />
          </div>


          <div>
           
            <select
              value={novoAluno.turma}
              onChange={(e) =>
                setNovoAluno({ ...novoAluno, turma: e.target.value })
              }
              required
              className="w-full px-4 py-2 focus:border-blue-500 focus:outline-none text-gray-400 border border-gray-300 rounded-lg appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22%23666%22 viewBox=%220 0 20 20%22%3E%3Cpath d=%22M5.516 7.548a.625.625 0 0 1 .884-.022L10 10.828l3.6-3.302a.625.625 0 1 1 .84.932l-4.02 3.69a.625.625 0 0 1-.84 0l-4.02-3.69a.625.625 0 0 1-.022-.884z%22/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-[length:1.25rem]"
            >
              <option value="">Selecione a Turma</option>
              <option value="Kids 1 A">Kids 1 A</option>
              <option value="Kids 1 B">Kids 1 B</option>
              <option value="Kids2 A">Kids2 A</option>
              <option value="Kids2 B">Kids2 B</option>
              <option value="Teens">Teens</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Avançado">Avançado</option>
              <option value="Mista">Mista</option>
              <option value="Escola">Escola</option>
              <option value="Body Box">Body Box</option>
              <option value="Kickboxing">Kickboxing</option>
              <option value="Kickboxing/feminino">Kickboxing/feminino</option>
           
            </select>

          </div>
          <div></div>
          <div>
           
            <select
              value={novoAluno.professor}
              onChange={(e) =>
                setNovoAluno({ ...novoAluno, professor: e.target.value })
              }
              required
              className="w-full px-4 py-2 focus:border-blue-500 focus:outline-none text-gray-400 border border-gray-300 rounded-lg appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22%23666%22 viewBox=%220 0 20 20%22%3E%3Cpath d=%22M5.516 7.548a.625.625 0 0 1 .884-.022L10 10.828l3.6-3.302a.625.625 0 1 1 .84.932l-4.02 3.69a.625.625 0 0 1-.84 0l-4.02-3.69a.625.625 0 0 1-.022-.884z%22/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-[length:1.25rem]"
            >
              <option value="">Selecione o Professor</option>
              <option value="Abner">Abner</option>
              <option value="Fabio">Fabio</option>
              <option value="Fabiana">Fabiana</option>
              <option value="Mauro">Mauro</option>
             
            </select>

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
              <option value="branca-infantil">Branca Infantil</option>
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
