// src/pages/Professores.jsx
import React, { useEffect, useState } from 'react';

function Professores() {
  const [professores, setProfessores] = useState([]);
  const [novoProfessor, setNovoProfessor] = useState({
    nome: '',
    email: '',
    telefone: '',
    autorizado: false
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/professores')
      .then(response => response.json())
      .then(data => setProfessores(data))
      .catch(err => console.error('Erro ao buscar professores:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/professores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoProfessor)
    })
      .then(response => response.json())
      .then(data => {
        setProfessores([...professores, data]);
        setNovoProfessor({ nome: '', email: '', telefone: '', autorizado: false });
      })
      .catch(err => console.error('Erro ao adicionar professor:', err));
  };

  return (
    <div style={{ padding: '1rem' }}>
 
      <table border="1" cellPadding="8" cellSpacing="0">
    
        <tbody>
          {professores.map(prof => (
            <tr key={prof.id}>
              <td>{prof.id}</td>
              <td>{prof.nome}</td>
              <td>{prof.email}</td>
              <td>{prof.telefone}</td>
              <td>{prof.autorizado ? 'Sim' : 'Não'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Adicionar Professor</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 position-relative">
          <input
            type="text"
            id="nome"
            className="form-control"
            value={novoProfessor.nome}
            onChange={(e) => setNovoProfessor({ ...novoProfessor, nome: e.target.value })}
            required
          />
          <label htmlFor="nome" className="form-label position-absolute top-0 start-0 ms-2 mt-2">
            Nome
          </label>
        </div>

        <div className="mb-3 position-relative">
          <input
            type="email"
            id="email"
            className="form-control"
            value={novoProfessor.email}
            onChange={(e) => setNovoProfessor({ ...novoProfessor, email: e.target.value })}
            required
          />
          <label htmlFor="email" className="form-label position-absolute top-0 start-0 ms-2 mt-2">
            Email
          </label>
        </div>

        <div className="mb-3 position-relative">
          <input
            type="text"
            id="telefone"
            className="form-control"
            value={novoProfessor.telefone}
            onChange={(e) => setNovoProfessor({ ...novoProfessor, telefone: e.target.value })}
          />
          <label htmlFor="telefone" className="form-label position-absolute top-0 start-0 ms-2 mt-2">
            Telefone
          </label>
        </div>

        <div className="mb-3">
          <label>
            Autorizado:
            <input
              type="checkbox"
              checked={novoProfessor.autorizado}
              onChange={(e) => setNovoProfessor({ ...novoProfessor, autorizado: e.target.checked })}
            />
          </label>
        </div>

        <button type="submit" className="btn btn-primary">Adicionar</button>
      </form>
    </div>
  );
}

export default Professores;
