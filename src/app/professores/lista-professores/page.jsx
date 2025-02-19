"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '../../componetes/Header/Header';
import Footer from '../../componetes/Footer/Footer';
import { Pencil, Trash, Save, XCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthProvider';

function ListaProfessores() {
    const [professores, setProfessores] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [professorEditado, setProfessorEditado] = useState({
        nome: '',
        email: '',
        telefone: '',
    });

    const router = useRouter();
    const { token, setToken } = useContext(AuthContext);
    // console.log('Token:', token); 

    // Verificar se o token está válido antes de realizar qualquer requisição
    const verificarTokenValido = async () => {
        try {
            const response = await fetch('http://10.200.200.62:5001/professores/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Token inválido ou expirado');
            }
            return true;
        } catch (error) {
            console.error(error);
            // Remove o token do localStorage e do contexto caso não seja válido
            localStorage.removeItem('token');
            setToken(null); // Limpa o token no AuthContext
            return false;
        }
    };

    useEffect(() => {
        // Verifica se o token é válido
        verificarTokenValido().then(isValid => {
            if (isValid) {
                // Carregar a lista de professores
                fetch('http://10.200.200.62:5001/professores/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                })
                    .then(response => response.json())
                    .then(data => setProfessores(data))
                    .catch(err => console.error('Erro ao buscar professores:', err));
            } else {
                // Caso o token não seja válido, redireciona para login ou outra página
                router.push('/login');
            }
        });
    }, [token, setToken]); // Recarrega caso o token mude

    const salvarEdicao = (professor_id) => {
        fetch(`http://10.200.200.62:5001/professores/${professor_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Inclua o token no cabeçalho da requisição
            },
            body: JSON.stringify(professorEditado),
        })
            .then(response => response.json())
            .then(data => {
                setProfessores(professores.map(professor => professor.id === professor_id ? data : professor));
                setEditandoId(null);
            })
            .catch(err => console.error('Erro ao salvar professor:', err));
    };

    const excluirProfessor = (professor_id) => {
        fetch(`http://10.200.200.62:5001/professores/${professor_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(() => setProfessores(professores.filter(professor => professor.id !== professor_id)))
            .catch(err => console.error('Erro ao excluir professor:', err));
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto my-4 p-4">
                <button
                    className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg mb-3"
                    onClick={() => router.push('/professores/professores')}
                >
                    <ArrowLeft size={18} /> Cadastrar Professor
                </button>

                <h2 className="text-2xl text-center mb-4">Lista de Professores</h2>

                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4">ID</th>
                                <th className="py-2 px-4">Nome</th>
                                <th className="py-2 px-4">Email</th>
                                <th className="py-2 px-4">Telefone</th>
                                <th className="py-2 px-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {professores.map(professor => (
                                <tr key={professor.id} className="border-b">
                                    {editandoId === professor.id ? (
                                        <>
                                            <td className="py-2 px-4">{professor.id}</td>
                                            <td className="py-2 px-4">
                                                <input
                                                    type="text"
                                                    value={professorEditado.nome}
                                                    onChange={(e) => setProfessorEditado({ ...professorEditado, nome: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                />
                                            </td>
                                            <td className="py-2 px-4">
                                                <input
                                                    type="email"
                                                    value={professorEditado.email}
                                                    onChange={(e) => setProfessorEditado({ ...professorEditado, email: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                />
                                            </td>
                                            <td className="py-2 px-4">
                                                <input
                                                    type="text"
                                                    value={professorEditado.telefone}
                                                    onChange={(e) => setProfessorEditado({ ...professorEditado, telefone: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                />
                                            </td>
                                            <td className="py-2 px-4 flex space-x-2">
                                                <button
                                                    onClick={() => salvarEdicao(professor.id)}
                                                    className="bg-green-500 text-white p-2 rounded"
                                                >
                                                    <Save size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setEditandoId(null)}
                                                    className="bg-red-500 text-white p-2 rounded"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="py-2 px-4">{professor.id}</td>
                                            <td className="py-2 px-4">{professor.nome}</td>
                                            <td className="py-2 px-4">{professor.email}</td>
                                            <td className="py-2 px-4">{professor.telefone}</td>
                                            <td className="py-2 px-4 flex space-x-2">
                                                <button
                                                    onClick={() => setEditandoId(professor.id)}
                                                    className="bg-blue-500 text-white p-2 rounded"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => excluirProfessor(professor.id)}
                                                    className="bg-red-500 text-white p-2 rounded"
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

export default ListaProfessores;
