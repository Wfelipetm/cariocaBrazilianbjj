// src/pages/Planos.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Form, InputGroup } from 'react-bootstrap'; // Importando componentes do Bootstrap

function Planos() {
  const [planos, setPlanos] = useState([]);
  const [novoPlano, setNovoPlano] = useState({
    nome: '',
    descricao: '',
    valor: '',
    duracao_meses: ''
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/planos')
      .then(response => response.json())
      .then(data => setPlanos(data))
      .catch(err => console.error('Erro ao buscar planos:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/planos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoPlano)
    })
      .then(response => response.json())
      .then(data => {
        setPlanos([...planos, data]);
        setNovoPlano({ nome: '', descricao: '', valor: '', duracao_meses: '' });
      })
      .catch(err => console.error('Erro ao adicionar plano:', err));
  };

  return (
    <div className="container mt-4">
 

      {/* Tabela com estilo do Bootstrap */}
      <Table bordered responsive hover>
     
        <tbody>
          {planos.map(plano => (
            <tr key={plano.id}>
              <td>{plano.id}</td>
              <td>{plano.nome}</td>
              <td>{plano.descricao}</td>
              <td>{plano.valor}</td>
              <td>{plano.duracao_meses}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="mt-4 mb-4">Adicionar Plano</h2>

      {/* Formulário de Adicionar Plano com estilo do Bootstrap */}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nome" className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Nome"
              value={novoPlano.nome}
              onChange={(e) => setNovoPlano({ ...novoPlano, nome: e.target.value })}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="descricao" className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Descrição"
              value={novoPlano.descricao}
              onChange={(e) => setNovoPlano({ ...novoPlano, descricao: e.target.value })}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="valor" className="mb-3">
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="Valor"
              value={novoPlano.valor}
              onChange={(e) => setNovoPlano({ ...novoPlano, valor: e.target.value })}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="duracaoMeses" className="mb-3">
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="Duração (meses)"
              value={novoPlano.duracao_meses}
              onChange={(e) => setNovoPlano({ ...novoPlano, duracao_meses: e.target.value })}
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

export default Planos;
