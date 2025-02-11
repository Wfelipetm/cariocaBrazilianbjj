"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  // Usando useRouter do Next.js
import { ArrowLeft } from 'lucide-react';
import Header from '../../componetes/Header/Header';  // Caminho para o Header
import Footer from '../../componetes/Footer/Footer';
import { Pencil, Trash, Save, XCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';  // Importa o ícone do WhatsApp

function ListaAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [alunoEditado, setAlunoEditado] = useState({
    nome: '',
    email: '',
    telefone: '',
    matricula: '',
    faixa_atual: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:3000/alunos/')
      .then(response => response.json())
      .then(data => setAlunos(data))
      .catch(err => console.error('Erro ao buscar alunos:', err));
  }, []);

  const salvarEdicao = (id) => {
    fetch(`http://localhost:3000/alunos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alunoEditado),
    })
      .then(response => response.json())
      .then(data => {
        setAlunos(alunos.map(aluno => (aluno.id === id ? data : aluno)));
        setEditandoId(null);
      })
      .catch(err => console.error('Erro ao salvar aluno:', err));
  };

  const excluirAluno = (id) => {
    fetch(`http://localhost:3000/alunos/${id}`, { method: 'DELETE' })
      .then(() => {
        setAlunos(alunos.filter(aluno => aluno.id !== id));
      })
      .catch(err => console.error('Erro ao excluir aluno:', err));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto my-4 p-4">
        <button
          className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg mb-3"
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} /> Voltar
        </button>

        <h2 className="text-2xl text-center mb-4">Lista de Alunos</h2>

        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Nome</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Telefone</th>
                <th className="py-2 px-4">Faixa Atual</th>
                <th className="py-2 px-4">Matrícula</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {alunos.map(aluno => (
                <tr key={aluno.id} className="border-b">
                  {editandoId === aluno.id ? (
                    <>
                      <td className="py-2 px-4">{aluno.id}</td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          value={alunoEditado.nome}
                          onChange={(e) => setAlunoEditado({ ...alunoEditado, nome: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="email"
                          value={alunoEditado.email}
                          onChange={(e) => setAlunoEditado({ ...alunoEditado, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          value={alunoEditado.telefone}
                          onChange={(e) => setAlunoEditado({ ...alunoEditado, telefone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          value={alunoEditado.faixa_atual}
                          onChange={(e) => setAlunoEditado({ ...alunoEditado, faixa_atual: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          value={alunoEditado.matricula}
                          onChange={(e) => setAlunoEditado({ ...alunoEditado, matricula: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center"
                          onClick={() => salvarEdicao(aluno.id)}
                        >
                          <Save size={18} /> 
                        </button>
                        <button
                          className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                          onClick={() => setEditandoId(null)}
                        >
                          <XCircle size={18} /> 
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-4">{aluno.id}</td>
                      <td className="py-2 px-4">{aluno.nome}</td>
                      <td className="py-2 px-4">{aluno.email}</td>
                      {/* Telefone com ícone de WhatsApp */}
                      <td className="py-2 px-4 flex items-center gap-2">
                        <span>{aluno.telefone}</span>
                        <a
                          href={`https://wa.me/${aluno.telefone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaWhatsapp size={18} className="text-green-500" />
                        </a>
                      </td>
                      <td className="py-2 px-4">{aluno.faixa_atual}</td>
                      <td className="py-2 px-4">{aluno.matricula}</td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center"
                          onClick={() => {
                            setEditandoId(aluno.id);
                            setAlunoEditado(aluno);
                          }}
                        >
                          <Pencil size={18} /> 
                        </button>
                        <button
                          className="bg-red-500 text-white py-1 px-4 rounded-lg"
                          onClick={() => excluirAluno(aluno.id)}
                        >
                          <Trash size={18} /> 
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ListaAlunos;
