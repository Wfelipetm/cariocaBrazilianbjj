"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Header from "../componetes/Header/Header";
import Footer from "../componetes/Footer/Footer";
import { AuthContext } from "../context/AuthProvider";

function Alunos() {
  const { user, token } = useContext(AuthContext);  // Aqui já pega o token do contexto
  const router = useRouter();
    const [nomes, setNomes] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');
  const [filtrados, setFiltrados] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Estado para armazenar os nomes dos usuários
  const [novoAluno, setNovoAluno] = useState({
    nome: "",
    email: "",
    telefone: "",
    matricula: "",
    faixa_atual: "",
    data_pagamento: "",
    professor: "",
    turma: "",
    userId: user?.id || "",
  });



  useEffect(() => {
    if (!token) return;

    fetch("http://10.200.200.62:5001/auth/users", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Dados recebidos:", data);
        setNomes(data);
        setFiltrados(data);
      })


      .catch((err) => console.error("Erro ao buscar usuários:", err));


  }, [token]);
  



  const handleSearchChange = (e) => {
    const valorBusca = e.target.value || '';
    setSearch(valorBusca);
  
    // Filtra os dados com base no termo de busca
    const nomesFiltrados = nomes.filter((usuario) =>
      usuario.nome.toLowerCase().startsWith(valorBusca.toLowerCase())
    );
  
    setFiltrados(nomesFiltrados); // Atualiza o estado de filtrados
  };
  


  

  // Seleção de um usuário
  const handleUserSelect = (usuario) => {
    setNovoAluno({
      ...novoAluno,
      nome: usuario.nome,  // Atualiza com o nome do usuário selecionado
      usuarioId: usuario.id_usuario,  // Define o id do usuário selecionado
    });
    setSearch(usuario.nome);  // Atualiza o campo de busca com o nome do usuário
    setFiltrados([]);  // Limpa a lista de filtrados após a seleção
  };
  


  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://10.200.200.62:5001/alunos/criar_aluno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoAluno),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Aluno criado:", data);
      })
      .catch((err) => console.error("Erro ao criar aluno:", err));
  };




  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto my-4 p-4 bg-transparent">
        <h2 className="text-2xl text-center mb-5 font-semibold">Adicionar Novo Aluno</h2>
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-3">

              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Digite para filtrar"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              />
             {filtrados.length > 0 && search && (
  <ul className="max-h-40 overflow-y-auto mt-1 border border-gray-300 p-0">
    {filtrados.map((usuario) => (
      <li
        key={usuario.id_usuario} // Usando id_usuario como chave
        className="p-2 cursor-pointer hover:bg-gray-100"
        onClick={() => handleUserSelect(usuario)} // Passando o objeto inteiro do usuário
      >
        {usuario.nome} {/* Exibindo o nome do usuário */}
      </li>
    ))}
  </ul>
)}

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
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"

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
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"

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
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                style={{ display: "none" }}
              />
            </div>
            <div>
              <input
                type="date"
                placeholder="Data pagamento"
                value={novoAluno.data_pagamento}
                onChange={(e) => {
                  // Formata a data para garantir que esteja no formato correto (ano-mês-dia)
                  const formattedDate = e.target.value;
                  setNovoAluno({ ...novoAluno, data_pagamento: formattedDate });
                }}
                className={`w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
    `} />
            </div>




            <div>

              <select
                value={novoAluno.turma}
                onChange={(e) =>
                  setNovoAluno({ ...novoAluno, turma: e.target.value })
                }
                required
                className={`w-full px-4 py-2 focus:border-blue-500 focus:outline-none ${novoAluno.turma ? "text-black" : "text-gray-400"
                  } border border-gray-300 rounded appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22%23666%22 viewBox=%220 0 20 20%22%3E%3Cpath d=%22M5.516 7.548a.625.625 0 0 1 .884-.022L10 10.828l3.6-3.302a.625.625 0 1 1 .84.932l-4.02 3.69a.625.625 0 0 1-.84 0l-4.02-3.69a.625.625 0 0 1-.022-.884z%22/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-[length:1.25rem]`}
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
                className={`w-full px-4 py-2 focus:border-blue-500 focus:outline-none ${novoAluno.professor ? "text-black" : "text-gray-400"
                  } border border-gray-300 rounded appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22%23666%22 viewBox=%220 0 20 20%22%3E%3Cpath d=%22M5.516 7.548a.625.625 0 0 1 .884-.022L10 10.828l3.6-3.302a.625.625 0 1 1 .84.932l-4.02 3.69a.625.625 0 0 1-.84 0l-4.02-3.69a.625.625 0 0 1-.022-.884z%22/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-[length:1.25rem]`}
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
                className={`w-full px-4 py-2 focus:border-blue-500 focus:outline-none ${novoAluno.faixa_atual ? "text-black" : "text-gray-400"
                  } border border-gray-300 rounded appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22%23666%22 viewBox=%220 0 20 20%22%3E%3Cpath d=%22M5.516 7.548a.625.625 0 0 1 .884-.022L10 10.828l3.6-3.302a.625.625 0 1 1 .84.932l-4.02 3.69a.625.625 0 0 1-.84 0l-4.02-3.69a.625.625 0 0 1-.022-.884z%22/%3E%3C/svg%3E')] bg-no-repeat bg-right bg-[length:1.25rem]`}
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
          </form>
          <div className="flex gap-4 mt-5">
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-500 text-white rounded"
            >
              Adicionar
            </button>
            <button
              onClick={() => router.push("/alunos/listar-alunos")}
              className="flex-1 py-2 px-3 bg-gray-500 text-white rounded"
            >
              Ver Lista de Alunos
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Alunos;
