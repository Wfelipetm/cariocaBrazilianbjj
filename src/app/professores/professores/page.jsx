"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../componetes/Header/Header';
import Footer from '../../componetes/Footer/Footer';

function CadastrarProfessor() {
  const [professor, setProfessor] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    role: 'professor', // Role inicial: usuário, professor ou admin
  });

  const router = useRouter();

  const cadastrarProfessor = async () => {
    // Exibe o JSON dos dados que serão enviados para o registro do usuário
    // console.log('Dados enviados para registro de usuário:', JSON.stringify(professor));

    try {
      // 1. Registrar o usuário (na tabela users) através do endpoint /auth/register
      const userResponse = await fetch('http://10.200.200.62:5001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: professor.nome,
          email: professor.email,
          senha: professor.senha,
          role: professor.role,
        }),
      });

      const userData = await userResponse.json();
      console.log('Usuário registrado:', userData);

      if (userData.error) {
        console.error('Erro no registro de usuário:', userData.error);
        return;
      }
      const usuarioId = userData.usuario && userData.usuario.id;

      if (!usuarioId) {
        console.error('ID do usuário não encontrado na resposta:', userData);
        return;
      }

      // 2. Registrar o professor na tabela "professores" utilizando o ID do usuário
      const novoProfessor = {
        nome: professor.nome,
        email: professor.email,
        telefone: professor.telefone,
        autorizado: false,
        usuario_id: usuarioId,
      };
      // console.log('Dados enviados para registro de professor:', JSON.stringify(novoProfessor));
      const profResponse = await fetch('http://10.200.200.62:5001/professores/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProfessor),
      });

      if (!profResponse.ok) {
        const errorData = await profResponse.json();
        // console.error('Erro ao registrar professor:', errorData);
        return;
      }
      const profData = await profResponse.json();
      //console.log('Professor cadastrado:', profData);
      router.push('/professores/lista-professores');
    } catch (err) {
      console.error('Erro ao cadastrar professor:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto my-4 p-4">
        <h2 className="text-2xl text-center mb-5 font-semibold">Cadastrar Professor</h2>
        <div className="max-w-md mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              cadastrarProfessor();
            }}
          >
            <input
              type="text"
              placeholder="Nome"
              value={professor.nome}
              onChange={(e) => setProfessor({ ...professor, nome: e.target.value })}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={professor.email}
              onChange={(e) => setProfessor({ ...professor, email: e.target.value })}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={professor.senha}
              onChange={(e) => setProfessor({ ...professor, senha: e.target.value })}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              placeholder="Telefone"
              value={professor.telefone}
              onChange={(e) => setProfessor({ ...professor, telefone: e.target.value })}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded"
              required
            />
            <select
              value={professor.role}
              onChange={(e) => setProfessor({ ...professor, role: e.target.value })}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded"
              required
            >
              <option value="usuario">Usuário</option>
              <option value="professor">Professor</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-4 mt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded"
              >
                Cadastrar
              </button>
              <button
                type="button"
                onClick={() => router.push('/professores/lista-professores')}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded"
              >
                Ver Lista de Professores
              </button>
            </div>

          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CadastrarProfessor;
