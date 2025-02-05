"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from '../componetes/Header/Header';
import Footer from '../componetes/Footer/Footer';
import { Pencil, Trash, Save, XCircle } from 'lucide-react';  

function PresencasPorMesClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const alunoId = searchParams.get("aluno_id"); // Obtém o aluno_id da URL

    const [presencas, setPresencas] = useState([]);
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [editando, setEditando] = useState(null); // Controle de edição
    const [novaData, setNovaData] = useState(null); // Nova data para edição
    const [alunoNome, setAlunoNome] = useState("");

    useEffect(() => {
        if (alunoId) {
            // Primeiro, buscar os dados do aluno
            fetch(`http://localhost:3000/alunos/${alunoId}`)
                .then((response) => response.json())
                .then((data) => {
                    setAlunoNome(data.nome);  // Armazenar o nome do aluno no estado
                })
                .catch((err) => console.error("Erro ao buscar aluno:", err));

            const mes = String(dataSelecionada.getMonth() + 1).padStart(2, "0");
            const ano = dataSelecionada.getFullYear();

            // Requisição para buscar as presenças do aluno filtradas por mês e ano
            fetch(`http://localhost:3000/presencas/${alunoId}/mes?mes=${mes}&ano=${ano}`)
                .then((response) => response.json())
                .then((data) => setPresencas(data))
                .catch((err) => console.error("Erro ao buscar presenças:", err));
        }
    }, [alunoId, dataSelecionada]);

    // Função para formatar nome
    function formatarNome(nomeCompleto) {
        const partes = nomeCompleto.split(" ");
        const primeiroNome = partes[0];
        const ultimoSobrenome = partes[partes.length - 1];
        return `${primeiroNome} ${ultimoSobrenome}`;
    }

    const handleDateChange = (date) => {
        setDataSelecionada(date);
    };

    const handleEditar = (id, dataCheckin) => {
        setEditando(id);
        setNovaData(new Date(dataCheckin));
    };

    const handleSalvarEdicao = (id) => {
        // Formatação da data para o formato "YYYY-MM-DD"
        const dataPresenca = `${novaData.getFullYear()}-${String(
            novaData.getMonth() + 1
        ).padStart(2, "0")}-${String(novaData.getDate()).padStart(2, "0")}`;

        fetch(`http://localhost:3000/presencas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                aluno_id: alunoId,
                data_presenca: dataPresenca,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Presença atualizada:", data);
                setPresencas((prevPresencas) =>
                    prevPresencas.map((p) =>
                        p.id === id ? { ...p, data_checkin: dataPresenca } : p
                    )
                );
                setEditando(null);
            })
            .catch((err) => console.error("Erro ao atualizar presença:", err));
    };

    const handleExcluir = (id) => {
        fetch(`http://localhost:3000/presencas/${id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Presença excluída:", data);
                setPresencas((prevPresencas) => prevPresencas.filter((p) => p.id !== id));
            })
            .catch((err) => console.error("Erro ao excluir presença:", err));
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto my-4 p-4">
            <h2 className="text-2xl font-bold mb-4">Presenças do Aluno {formatarNome(alunoNome)}</h2>

                {/* Seletor de Mês e Ano */}
                <div className="my-4 flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Mês e Ano:</label>
                    <DatePicker
                        selected={dataSelecionada}
                        onChange={handleDateChange}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                </div>

                {/* Tabela de presenças */}
                {presencas.length > 0 ? (
                    <table className="min-w-full border border-gray-200 mt-4">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 border">Data</th>
                                <th className="py-2 px-4 border">Nome</th>
                                <th className="py-2 px-4 border">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {presencas.map((p) => (
                                <tr key={p.id} className="border-b">
                                    <td className="py-2 px-4 border">
                                        {editando === p.id ? (
                                            <DatePicker
                                                selected={novaData}
                                                onChange={setNovaData}
                                                dateFormat="dd/MM/yyyy"
                                                className="border border-gray-300 rounded px-2 py-1 w-32"
                                            />
                                        ) : (
                                            new Date(p.data_checkin).toLocaleDateString("pt-BR")
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border">{p.nome_aluno}</td>
                                    <td className="py-2 px-4 border">
                                        {editando === p.id ? (
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleSalvarEdicao(p.id)}
                                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center mr-3"
                                                >
                                                     <Save size={18} className="" /> 
                                                 
                                                </button>
                                                <button
                                                    onClick={() => setEditando(null)}
                                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                                                >
                                                    <XCircle size={18} className="" /> 
                                                    
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEditar(p.id, p.data_checkin)}
                                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center mr-3"
                                                >
                                                     <Pencil size={18} className="" /> 
                                                    
                                                </button>
                                                <button
                                                    onClick={() => handleExcluir(p.id)}
                                                    className="bg-red-500 text-white py-1 px-4 rounded-lg"
                                                >
                                                     <Trash size={18} className="" /> 
                                                    
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="mt-4">Nenhuma presença encontrada para o aluno.</p>
                )}

                {/* Botão de voltar */}
                <button
                    onClick={() => router.back()}
                    className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Voltar
                </button>
            </main>
            <Footer />
        </div>
    );
}

export default PresencasPorMesClient;
