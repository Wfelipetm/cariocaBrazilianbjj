"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Usando useRouter do Next.js
import Header from '../componetes/Header/Header';  // Caminho para o Header
import Footer from '../componetes/Footer/Footer';

function Alunos() {
  const [novoAluno, setNovoAluno] = useState({ nome: '', email: '', telefone: '', contrato: '' });
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/alunos/aluno', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoAluno)
    })
      .then(response => response.json())
      .then(data => {
        setNovoAluno({ nome: '', email: '', telefone: '', contrato: '' });
      })
      .catch(err => console.error('Erro ao adicionar aluno:', err));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Conteúdo principal */}
      <main className="flex-grow container mx-auto my-4 p-4 bg-transparent">
        <h2 className="text-2xl text-center mb-5 font-semibold">Adicionar Novo Aluno</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nome"
              value={novoAluno.nome}
              onChange={(e) => setNovoAluno({ ...novoAluno, nome: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={novoAluno.email}
              onChange={(e) => setNovoAluno({ ...novoAluno, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Telefone"
              value={novoAluno.telefone}
              onChange={(e) => setNovoAluno({ ...novoAluno, telefone: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Contrato"
              value={novoAluno.contrato}
              onChange={(e) => setNovoAluno({ ...novoAluno, contrato: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button type="submit" className="w-40 py-2 bg-blue-500 text-white rounded-lg">
            Adicionar
          </button>
        </form>
        <button
          onClick={() => router.push('/alunos/listar-alunos')}
          className="mt-4 py-2 px-3 bg-gray-500 text-white rounded-lg"

        >
          Ver Lista de Alunos
        </button>
      </main>

      {/* Footer sempre no fundo */}
      <Footer />
    </div>
  );
}

export default Alunos;
