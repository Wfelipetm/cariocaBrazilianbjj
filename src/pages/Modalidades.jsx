// src/pages/Modalidades.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Form, InputGroup } from 'react-bootstrap'; // Importando componentes do Bootstrap

function Modalidades() {
  const [modalidades, setModalidades] = useState([]);
  const [novaModalidade, setNovaModalidade] = useState({ nome: '', descricao: '' });

  useEffect(() => {
    fetch('http://localhost:3000/api/modalidades')
      .then(response => response.json())
      .then(data => setModalidades(data))
      .catch(err => console.error('Erro ao buscar modalidades:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/modalidades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaModalidade)
    })
      .then(response => response.json())
      .then(data => {
        setModalidades([...modalidades, data]);
        setNovaModalidade({ nome: '', descricao: '' });
      })
      .catch(err => console.error('Erro ao adicionar modalidade:', err));
  };

  return (
    <div className="container mt-4">
   
      {/* Tabela com estilo do Bootstrap */}
      <Table bordered responsive hover>
     
        <tbody>
          {modalidades.map(mod => (
            <tr key={mod.id}>
              <td>{mod.id}</td>
              <td>{mod.nome}</td>
              <td>{mod.descricao}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="mt-4 mb-4">Adicionar Modalidade</h2>

      {/* Formulário de Adicionar Modalidade com estilo do Bootstrap */}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nomeModalidade" className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Nome"
              value={novaModalidade.nome}
              onChange={(e) => setNovaModalidade({ ...novaModalidade, nome: e.target.value })}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="descricaoModalidade" className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Descrição"
              value={novaModalidade.descricao}
              onChange={(e) => setNovaModalidade({ ...novaModalidade, descricao: e.target.value })}
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

export default Modalidades;
