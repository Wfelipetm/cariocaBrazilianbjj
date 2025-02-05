import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Presencas() {
  const [alunos, setAlunos] = useState([]); // Lista de alunos
  const [filtrados, setFiltrados] = useState([]); // Alunos filtrados
  const [novoPresenca, setNovoPresenca] = useState({
    aluno_id: '',
    data_checkin: '', // Ajustando para data_checkin
    nome_aluno: ''
  });
  const [search, setSearch] = useState(''); // Valor do campo de busca

  const navigate = useNavigate();

  useEffect(() => {
    // Carregar a lista de alunos
    fetch('http://localhost:3000/alunos')
      .then(response => response.json())
      .then(data => {
        setAlunos(data);
        setFiltrados(data); // Inicialmente, todos os alunos são visíveis
      })
      .catch(err => console.error('Erro ao carregar alunos:', err));

    // Definir a data atual no formato 'YYYY-MM-DD'
    const dataAtual = new Date().toISOString().split('T')[0];
    setNovoPresenca(prevState => ({
      ...prevState,
      data_checkin: dataAtual
    }));
  }, []);

  const handleSearchChange = (e) => {
    const valorBusca = e.target.value;
    setSearch(valorBusca);

    // Filtra os alunos que começam com a letra digitada
    const alunosFiltrados = alunos.filter(aluno =>
      aluno.nome.toLowerCase().startsWith(valorBusca.toLowerCase())
    );

    setFiltrados(alunosFiltrados); // Atualiza os alunos filtrados
  };

  const handleAlunoSelect = (aluno) => {
    setNovoPresenca({
      ...novoPresenca,
      aluno_id: aluno.id,
      nome_aluno: aluno.nome
    });
    setSearch(aluno.nome); // Atualiza o campo de busca com o nome do aluno selecionado
    setFiltrados([]); // Limpa a lista de filtrados após a seleção
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Requisição POST para registrar a presença
    fetch('http://localhost:3000/presencas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aluno_id: novoPresenca.aluno_id,
        data_checkin: novoPresenca.data_checkin, // Usando data_checkin
      })
    })
      .then(response => response.json())
      .then(() => {
        alert('Presença registrada com sucesso!');
        setNovoPresenca({ aluno_id: '', data_checkin: '', nome_aluno: '' });
        setSearch('');
        setFiltrados(alunos); // Restaura a lista de alunos ao valor original
      })
      .catch(err => console.error('Erro ao registrar presença:', err));
  };

  return (
    <div className="container mt-4">
      <h2>Registrar Presença</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="alunoId" className="mb-3">
          <Form.Label>Nome do Aluno</Form.Label>
          <Form.Control
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Digite para filtrar"
          />
          {filtrados.length > 0 && search && (
            <ul style={{ maxHeight: '150px', overflowY: 'auto', padding: 0, marginTop: '5px', border: '1px solid #ccc' }}>
              {filtrados.map(aluno => (
                <li
                  key={aluno.id}
                  style={{ padding: '8px', cursor: 'pointer' }}
                  onClick={() => handleAlunoSelect(aluno)}
                >
                  {aluno.nome}
                </li>
              ))}
            </ul>
          )}
        </Form.Group>

        <Form.Group controlId="data" className="mb-3">
          <Form.Label>Data</Form.Label>
          <Form.Control
            type="date"
            value={novoPresenca.data_checkin}
            onChange={(e) => setNovoPresenca({ ...novoPresenca, data_checkin: e.target.value })}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Registrar
        </Button>

        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate(`/presencas-por-mes?aluno_id=${novoPresenca.aluno_id}`)}
          disabled={!novoPresenca.aluno_id}
        >
          Ver Presenças do Aluno
        </Button>
      </Form>
    </div>
  );
}

export default Presencas;
