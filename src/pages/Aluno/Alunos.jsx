import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Alunos() {
  const [novoAluno, setNovoAluno] = useState({ nome: '', email: '', telefone: '', contrato: '' });
  const navigate = useNavigate();

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
    <div className="container my-4" style={{ backgroundColor: 'transparent' }}>
      <h2 className="subtitle text-center mb-5">Adicionar Novo Aluno</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Nome"
            value={novoAluno.nome}
            onChange={(e) => setNovoAluno({ ...novoAluno, nome: e.target.value })}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={novoAluno.email}
            onChange={(e) => setNovoAluno({ ...novoAluno, email: e.target.value })}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Telefone"
            value={novoAluno.telefone}
            onChange={(e) => setNovoAluno({ ...novoAluno, telefone: e.target.value })}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Contrato"
            value={novoAluno.contrato}
            onChange={(e) => setNovoAluno({ ...novoAluno, contrato: e.target.value })}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary w-40" style={{ textAlign: 'left' }}>Adicionar</button>
      </form>
      <button onClick={() => navigate('/listaalunos')} className="btn btn-secondary mt-4">
        Ver Lista de Alunos
      </button>
    </div>
  );
}

export default Alunos;