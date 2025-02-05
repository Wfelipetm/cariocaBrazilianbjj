// src/pages/Graduacao.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Form, InputGroup } from 'react-bootstrap'; // Importando componentes do Bootstrap

function Graduacao() {
  const [graduacoes, setGraduacoes] = useState([]);
  const [novoGraduacao, setNovoGraduacao] = useState({
    aluno_id: '',
    aulas_assistidas: 0,
    nivel_atual: '',
    proximo_nivel: '',
    aulas_para_graduar: ''
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/graduacao')
      .then(response => response.json())
      .then(data => setGraduacoes(data))
      .catch(err => console.error('Erro ao buscar graduações:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/graduacao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoGraduacao)
    })
      .then(response => response.json())
      .then(data => {
        setGraduacoes([...graduacoes, data]);
        setNovoGraduacao({
          aluno_id: '',
          aulas_assistidas: 0,
          nivel_atual: '',
          proximo_nivel: '',
          aulas_para_graduar: ''
        });
      })
      .catch(err => console.error('Erro ao adicionar graduação:', err));
  };

  return (
    <div className="container mt-4">


      {/* Tabela com estilo do Bootstrap */}
      <Table bordered responsive hover>

        <tbody>
          {graduacoes.map(g => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.aluno_id}</td>
              <td>{g.aulas_assistidas}</td>
              <td>{g.nivel_atual}</td>
              <td>{g.proximo_nivel}</td>
              <td>{g.aulas_para_graduar}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="mt-4 mb-4">Adicionar Graduação</h2>

      {/* Formulário de Adicionar Graduação com estilo do Bootstrap */}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="aulasAssistidas" className="mb-3">
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="Aulas Assistidas"
              value={novoGraduacao.aulas_assistidas}
              onChange={(e) => setNovoGraduacao({ ...novoGraduacao, aulas_assistidas: e.target.value })}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="nivelAtual" className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Nível Atual"
              value={novoGraduacao.nivel_atual}
              onChange={(e) => setNovoGraduacao({ ...novoGraduacao, nivel_atual: e.target.value })}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="proximoNivel" className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Próximo Nível"
              value={novoGraduacao.proximo_nivel}
              onChange={(e) => setNovoGraduacao({ ...novoGraduacao, proximo_nivel: e.target.value })}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="aulasParaGraduar" className="mb-3">
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="Aulas para Graduar"
              value={novoGraduacao.aulas_para_graduar}
              onChange={(e) => setNovoGraduacao({ ...novoGraduacao, aulas_para_graduar: e.target.value })}
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

export default Graduacao;
