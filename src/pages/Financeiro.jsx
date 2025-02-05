// src/pages/Financeiro.jsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Financeiro() {
  const [financeiro, setFinanceiro] = useState([]);
  const [novoFinanceiro, setNovoFinanceiro] = useState({
    aluno_id: '',
    plano_id: '',
    data_vencimento: '',
    status_pagamento: 'PENDENTE',
    valor: '',
    data_pagamento: ''
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/financeiro')
      .then(response => response.json())
      .then(data => setFinanceiro(data))
      .catch(err => console.error('Erro ao buscar registros financeiros:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/financeiro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoFinanceiro)
    })
      .then(response => response.json())
      .then(data => {
        setFinanceiro([...financeiro, data]);
        setNovoFinanceiro({
          aluno_id: '',
          plano_id: '',
          data_vencimento: '',
          status_pagamento: 'PENDENTE',
          valor: '',
          data_pagamento: ''
        });
      })
      .catch(err => console.error('Erro ao adicionar registro financeiro:', err));
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
   
      <table className="table table-bordered">
    
        <tbody>
          {financeiro.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.aluno_id}</td>
              <td>{f.plano_id}</td>
              <td>{f.data_vencimento}</td>
              <td>{f.status_pagamento}</td>
              <td>{f.valor}</td>
              <td>{f.data_pagamento}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-5">Adicionar Registro Financeiro</h2>
      <form onSubmit={handleSubmit}>
  <div className="mb-3 position-relative">
    <input
      type="number"
      id="aluno_id"
      className="form-control"
      value={novoFinanceiro.aluno_id}
      onChange={(e) => setNovoFinanceiro({ ...novoFinanceiro, aluno_id: e.target.value })}
      required
    />
    <label htmlFor="aluno_id" className="form-label position-absolute top-0 start-0 ms-2 mt-2">
      Aluno ID
    </label>
  </div>

  <div className="mb-3 position-relative">
    <input
      type="number"
      id="plano_id"
      className="form-control"
      value={novoFinanceiro.plano_id}
      onChange={(e) => setNovoFinanceiro({ ...novoFinanceiro, plano_id: e.target.value })}
      required
    />
    <label htmlFor="plano_id" className="form-label position-absolute top-0 start-0 ms-2 mt-2">
      Plano ID
    </label>
  </div>

        <div className="mb-3">
          <label htmlFor="data_vencimento" className="form-label">Data Vencimento</label>
          <input
            type="date"
            id="data_vencimento"
            className="form-control"
            value={novoFinanceiro.data_vencimento}
            onChange={(e) => setNovoFinanceiro({ ...novoFinanceiro, data_vencimento: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="status_pagamento" className="form-label">Status Pagamento</label>
          <select
            id="status_pagamento"
            className="form-select"
            value={novoFinanceiro.status_pagamento}
            onChange={(e) => setNovoFinanceiro({ ...novoFinanceiro, status_pagamento: e.target.value })}
          >
            <option value="PENDENTE">PENDENTE</option>
            <option value="PAGO">PAGO</option>
            <option value="ATRASADO">ATRASADO</option>
          </select>
        </div>

        <div className="mb-3 position-relative">
    <input
      type="number"
      id="valor"
      className="form-control"
      value={novoFinanceiro.valor}
      onChange={(e) => setNovoFinanceiro({ ...novoFinanceiro, valor: e.target.value })}
      required
    />
    <label htmlFor="valor" className="form-label position-absolute top-0 start-0 ms-2 mt-2">
      Valor
    </label>
  </div>

        <div className="mb-3">
          <label htmlFor="data_pagamento" className="form-label">Data Pagamento</label>
          <input
            type="datetime-local"
            id="data_pagamento"
            className="form-control"
            value={novoFinanceiro.data_pagamento}
            onChange={(e) => setNovoFinanceiro({ ...novoFinanceiro, data_pagamento: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary">Adicionar</button>
      </form>
    </div>
  );
}

export default Financeiro;
