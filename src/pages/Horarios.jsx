// src/pages/Horarios.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Form, InputGroup } from 'react-bootstrap'; // Importando componentes do Bootstrap

function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [novoHorario, setNovoHorario] = useState({
    modalidade_id: '',
    dia_semana: '',
    horario_inicio: '',
    horario_fim: ''
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/horarios')
      .then(response => response.json())
      .then(data => setHorarios(data))
      .catch(err => console.error('Erro ao buscar horários:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/horarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoHorario)
    })
      .then(response => response.json())
      .then(data => {
        setHorarios([...horarios, data]);
        setNovoHorario({ modalidade_id: '', dia_semana: '', horario_inicio: '', horario_fim: '' });
      })
      .catch(err => console.error('Erro ao adicionar horário:', err));
  };

  return (
    <div className="container mt-4">
       
      {/* Tabela com estilo do Bootstrap */}
      <Table bordered responsive hover>
     
        <tbody>
          {horarios.map(h => (
            <tr key={h.id}>
              <td>{h.id}</td>
              <td>{h.modalidade_id}</td>
              <td>{h.dia_semana}</td>
              <td>{h.horario_inicio}</td>
              <td>{h.horario_fim}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="mt-4 mb-4">Adicionar Horário</h2>

      {/* Formulário de Adicionar Horário com estilo do Bootstrap */}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="modalidadeId" className="mb-3">
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="Modalidade ID"
              value={novoHorario.modalidade_id}
              onChange={(e) => setNovoHorario({ ...novoHorario, modalidade_id: e.target.value })}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="diaSemana" className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Dia da Semana"
              value={novoHorario.dia_semana}
              onChange={(e) => setNovoHorario({ ...novoHorario, dia_semana: e.target.value })}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="horarioInicio" className="mb-3">
          <InputGroup>
            <Form.Control
              type="time"
              placeholder="Horário Início"
              value={novoHorario.horario_inicio}
              onChange={(e) => setNovoHorario({ ...novoHorario, horario_inicio: e.target.value })}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="horarioFim" className="mb-3">
          <InputGroup>
            <Form.Control
              type="time"
              placeholder="Horário Fim"
              value={novoHorario.horario_fim}
              onChange={(e) => setNovoHorario({ ...novoHorario, horario_fim: e.target.value })}
              required
            />
          </InputGroup>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Adicionar
        </Button>
      </Form>
    </div>
  );
}

export default Horarios;
