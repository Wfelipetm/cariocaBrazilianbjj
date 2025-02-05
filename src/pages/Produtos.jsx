// src/pages/Produtos.jsx
import React, { useEffect, useState } from 'react';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: ''
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/produtos')
      .then(response => response.json())
      .then(data => setProdutos(data))
      .catch(err => console.error('Erro ao buscar produtos:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoProduto)
    })
      .then(response => response.json())
      .then(data => {
        setProdutos([...produtos, data]);
        setNovoProduto({ nome: '', descricao: '', preco: '', estoque: '' });
      })
      .catch(err => console.error('Erro ao adicionar produto:', err));
  };

  return (
    <div style={{ padding: '1rem' }}>
    
      <table border="1" cellPadding="8" cellSpacing="0">
      
        <tbody>
          {produtos.map(prod => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.nome}</td>
              <td>{prod.descricao}</td>
              <td>{prod.preco}</td>
              <td>{prod.estoque}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Adicionar Produto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 position-relative">
          <input
            type="text"
            id="nome"
            className="form-control"
            value={novoProduto.nome}
            onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
            required
          />
          <label htmlFor="nome" className="form-label position-absolute top-0 start-0 ms-2 mt-2">
            Nome
          </label>
        </div>

        <div className="mb-3 position-relative">
          <input
            type="text"
            id="descricao"
            className="form-control"
            value={novoProduto.descricao}
            onChange={(e) => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
          />
          <label htmlFor="descricao" className="form-label position-absolute top-0 start-0 ms-2 mt-2">
            Descrição
          </label>
        </div>

        <div className="mb-3 position-relative">
          <input
            type="number"
            id="preco"
            className="form-control"
            value={novoProduto.preco}
            onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })}
            required
          />
          <label htmlFor="preco" className="form-label position-absolute top-0 start-0 ms-2 mt-2">
            Preço
          </label>
        </div>

        <div className="mb-3 position-relative">
          <input
            type="number"
            id="estoque"
            className="form-control"
            value={novoProduto.estoque}
            onChange={(e) => setNovoProduto({ ...novoProduto, estoque: e.target.value })}
            required
          />
          <label htmlFor="estoque" className="form-label position-absolute top-0 start-0 ms-2 mt-2">
            Estoque
          </label>
        </div>

        <button type="submit" className="btn btn-primary">Adicionar</button>
      </form>
    </div>
  );
}

export default Produtos;
