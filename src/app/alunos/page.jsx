"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Header from "../componetes/Header/Header";
import Footer from "../componetes/Footer/Footer";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";

function Alunos() {
  const { user, token } = useContext(AuthContext);  // Aqui já pega o token do contexto
  const router = useRouter();
  const [nomes, setNomes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');
  const [filtrados, setFiltrados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(false);
  const [professores, setProfessores] = useState([]);

  const [novoAluno, setNovoAluno] = useState({
    nome: "",
    email: "",
    telefone: "",

    faixa_atual: "",
    data_pagamento: "",
    professor: "",
    turma: "",
    valor: "",
    userId: user?.id || "",  // Corrigido para `userId`
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

    if (valorBusca === '') {
      setFiltrados([]);
      return;
    }

    const nomesFiltrados = nomes.filter((usuario) =>
      usuario.nome.toLowerCase().includes(valorBusca.toLowerCase())
    );

    setFiltrados(nomesFiltrados);
  };






  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      alert("Token de autenticação não encontrado.");
      return;
    }

    // Converte a data de "YYYY-MM-DD" para "DD/MM/YYYY"
    const dataFormatada = novoAluno.data_pagamento.split('-').reverse().join('/');

    // Ajustando os dados para enviar, incluindo a data formatada
    const alunoParaCadastro = {
      ...novoAluno,
      data_pagamento: dataFormatada,  // Enviando a data formatada
      faixa_atual: "azul",  // Ajuste conforme necessário
    };

    // Não remover o `userId` aqui, pois ele é necessário para associar o aluno ao usuário
    console.log("Dados enviados para a criação do aluno:", alunoParaCadastro);

    fetch("http://10.200.200.62:5001/alunos/criar_aluno", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(alunoParaCadastro),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Aluno criado com sucesso:", data);
        router.push("/alunos/listar-alunos");
      })
      .catch((err) => {
        console.error("Erro ao criar aluno:", err);
        alert("Ocorreu um erro ao criar o aluno.");
      });
  };


  const handleUserSelect = (usuario) => {
    setNovoAluno({
      ...novoAluno,
      nome: usuario.nome,
      email: usuario.email,
      // Usando `id_usuario` em vez de `userId`
      id_usuario: usuario.id_usuario,
    });
    setSearch(usuario.nome);
    setFiltrados([]);
    setUsuarioSelecionado(true);
  };

  // Define a data de hoje ao carregar a página
  useEffect(() => {
    const hoje = new Date().toISOString().split("T")[0]; // Obtém a data no formato YYYY-MM-DD
    setNovoAluno((prev) => ({ ...prev, data_pagamento: hoje }));
  }, []);

  // Carregar professores da API
  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const response = await axios.get("http://10.200.200.62:5001/professores/");
        setProfessores(response.data); // Supondo que a API retorne um array de professores
      } catch (error) {
        console.error("Erro ao carregar professores:", error);
      }
    };

    fetchProfessores();
  }, []);

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
                disabled={usuarioSelecionado} // Desativa o campo após a seleção
              />

              {filtrados.length > 0 && search && !usuarioSelecionado && (
                <ul className="max-h-40 overflow-y-auto mt-1 border border-gray-300 p-0">
                  {filtrados.map((usuario) => (
                    <li
                      key={usuario.id_usuario}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleUserSelect(usuario)}
                    >
                      {usuario.nome}
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
                readOnly
                // onChange={(e) =>
                //   setNovoAluno({ ...novoAluno, email: e.target.value })
                // }
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
                placeholder="Nome Aluno"
                value={novoAluno.nome}
                onChange={(e) =>
                  setNovoAluno({ ...novoAluno, nome: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"

              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Valor"
                value={novoAluno.valor}
                onChange={(e) =>
                  setNovoAluno({ ...novoAluno, valor: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"

              />
            </div>

            <div>
              <input
                type="date"
                placeholder="Data pagamento"
                value={novoAluno.data_pagamento}
                onChange={(e) => {
                  let formattedDate = e.target.value;

                  // Extrai o dia, mês e ano da data
                  let [ano, mes, dia] = formattedDate.split("-");

                  // Obtém a data atual
                  const hoje = new Date();
                  const proximoMes = hoje.getMonth() + 1; // Mês atual + 1
                  const anoAtual = hoje.getFullYear();

                  // Se o mês atual for dezembro (12), o próximo mês será janeiro (01) do próximo ano
                  if (proximoMes === 12) {
                    dia = dia.padStart(2, "0"); // Certifica-se de que o dia tenha 2 dígitos
                    mes = "01"; // Próximo mês é janeiro
                    ano = (anoAtual + 1).toString(); // Avança para o próximo ano
                  } else {
                    mes = String(proximoMes + 1).padStart(2, "0"); // Avança para o próximo mês
                  }

                  // Ajusta a data com o próximo mês e um dos dias válidos (01, 05, 10, 20)
                  if (["01", "05", "10", "20"].includes(dia)) {
                    formattedDate = `${ano}-${mes}-${dia}`;
                    setNovoAluno({ ...novoAluno, data_pagamento: formattedDate });
                  } else {
                    alert(
                      "Por favor, selecione um dia de pagamento válido: 01, 05, 10 ou 20."
                    );
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              />
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
                {professores.map((professor) => (
                  <option key={professor.id} value={professor.nome}>
                    {professor.nome}
                  </option>
                ))}
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
                <option value="Branca-infantil">Branca Infantil</option>
                <option value="Cinza">Cinza</option>
                <option value="Cinza-branca">Cinza Branca</option>
                <option value="Cinza-preta">Cinza Preta</option>
                <option value="Amarela">Amarela</option>
                <option value="Amarela-branca">Amarela Branca</option>
                <option value="Amarela-preta">Amarela Preta</option>
                <option value="Laranja">Laranja</option>
                <option value="Laranja-branca">Laranja Branca</option>
                <option value="Laranja-preta">Laranja Preta</option>
                <option value="Verde">Verde</option>
                <option value="Verde-branca">Verde Branca</option>
                <option value="Verde-preta">Verde Preta</option>
                <option value="Branca-adulto">Branca Adulto</option>
                <option value="Azul">Azul</option>
                <option value="Roxa">Roxa</option>
                <option value="Marrom">Marrom</option>
                <option value="Preta">Preta</option>
                <option value="Coral">Coral</option>
                <option value="Vermelha">Vermelha</option>
              </select>

            </div>
          </form>
          <div className="flex gap-4 mt-5">
            <button
              onClick={handleSubmit} // Chamando handleSubmit ao clicar
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
