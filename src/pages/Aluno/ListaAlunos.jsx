import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function ListaAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [alunoEditado, setAlunoEditado] = useState({ nome: '', email: '', telefone: '', contrato: '' });
    const navigate = useNavigate();

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
        <div className="container my-4">
            <button
                className="btn mb-3"
                onClick={() => navigate(-1)}
                style={{
                    backgroundColor: '#094360',
                    color: '#ffffff',
                    padding: '10px 20px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                <ArrowLeft size={18} /> Voltar
            </button>

            <h2 className="text-center">Lista de Alunos</h2>
            <div className="table-responsive">
                <table className="table table-borderless">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Contrato</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunos.map(aluno => (
                            <tr key={aluno.id}>
                                {editandoId === aluno.id ? (
                                    <>
                                        <td>{aluno.id}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={alunoEditado.nome}
                                                onChange={(e) => setAlunoEditado({ ...alunoEditado, nome: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="email"
                                                value={alunoEditado.email}
                                                onChange={(e) => setAlunoEditado({ ...alunoEditado, email: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={alunoEditado.telefone}
                                                onChange={(e) => setAlunoEditado({ ...alunoEditado, telefone: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={alunoEditado.contrato}
                                                onChange={(e) => setAlunoEditado({ ...alunoEditado, contrato: e.target.value })}
                                            />
                                        </td>
                                        <td style={{ display: 'flex', gap: '10px' }}>
                                            <button className="btn btn-primary" onClick={() => salvarEdicao(aluno.id)}>Salvar</button>
                                            <button className="btn btn-secondary" onClick={() => setEditandoId(null)}>Cancelar</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{aluno.id}</td>
                                        <td>{aluno.nome}</td>
                                        <td>{aluno.email}</td>
                                        <td>{aluno.telefone}</td>
                                        <td>{aluno.contrato}</td>
                                        <td style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    setEditandoId(aluno.id);
                                                    setAlunoEditado(aluno);
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ padding: '0px 20px', fontSize: '16px', borderRadius: '8px' }}
                                                onClick={() => excluirAluno(aluno.id)}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListaAlunos;
