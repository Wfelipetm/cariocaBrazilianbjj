"use client";

import { useEffect, useState } from 'react';
import Header from '../../componetes/Header/Header.tsx';
import Footer from '../../componetes/Footer/Footer.tsx';
import { Pencil, Trash } from 'lucide-react';

export default function LojaProduto() {
  const [produtos, setProdutos] = useState([]);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [foto, setFoto] = useState(null);  // Estado para a foto

  const fetchProdutos = async () => {
    const res = await fetch('http://localhost:3000/produtos/');
    const data = await res.json();
    console.log('Produtos:', data);
    setProdutos(data);
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const editarProduto = (produto) => {
    console.log('Produto editando:', produto);
    setProdutoEditando(produto);
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setPreco(produto.preco ? produto.preco.toString() : ''); 
    setEstoque(produto.estoque ? produto.estoque.toString() : ''); 
    setFoto(null); // Limpa a foto para não mostrar foto anterior
  };

  const excluirProduto = async (id) => {
    console.log('Excluindo produto com ID:', id);
    const res = await fetch(`http://localhost:3000/produtos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Produto deletado com sucesso');
      setProdutos((prevProdutos) => prevProdutos.filter((produto) => produto.id !== id));
    } else {
      alert('Erro ao excluir produto');
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
    }
  };

  const salvarEdicao = async () => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('preco', parseFloat(preco));
    formData.append('estoque', parseInt(estoque, 10));
  
    if (foto) {
      formData.append('foto', foto);
    }
  
    const res = await fetch(`http://localhost:3000/produtos/${produtoEditando.id}`, {
      method: 'PUT',
      body: formData,
    });
  
    if (res.ok) {
      const updatedProduct = await res.json();
      console.log('Produto atualizado:', updatedProduct);
      alert('Produto atualizado com sucesso');
      fetchProdutos(); // Atualiza a lista de produtos
      setProdutoEditando(null);
      setNome('');
      setDescricao('');
      setPreco('');
      setEstoque('');
      setFoto(null); // Limpa o estado da foto
    } else {
      alert('Erro ao atualizar produto');
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <h1 className="text-2xl font-bold text-center my-8">Loja de Produtos</h1>

      <div className="flex-grow">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produtos.map((produto, index) => (
            <li
              key={produto.id || index}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-between"
            >
             <div className="flex items-center">
  {produto.foto && (
    <img
      className="w-40 h-35 object-cover rounded-md"
      src={
        produto.foto.includes('uploads') 
          ? `http://localhost:3000${produto.foto}`
          : `http://localhost:3000/uploads/${produto.foto}?v=${new Date().getTime()}`
      }
      alt={produto.nome}
    />
  )}
</div>


              <div className="flex flex-col space-y-2 ml-4 w-full">
                <p className="font-bold text-sm text-gray-700">
                  Nome: <span className="font-normal">{produto.nome}</span>
                </p>
                <p className="font-bold text-sm text-gray-700">
                  Estoque: <span className="font-normal">{produto.estoque}</span>
                </p>
                <p className="font-bold text-sm text-gray-700">
                  Valor: <span className="text-blue-500 font-bold">R${Number(produto.preco).toFixed(2)}</span>
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <button
                  className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                  aria-label="Editar"
                  onClick={() => editarProduto(produto)}
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                  aria-label="Excluir"
                  onClick={() => excluirProduto(produto.id)}
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {produtoEditando && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">Editar Produto</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="nome">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            className="w-full p-2 border border-gray-300 rounded"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="preco">
            Preço
          </label>
          <input
            type="number"
            id="preco"
            className="w-full p-2 border border-gray-300 rounded"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="estoque">
            Estoque
          </label>
          <input
            type="number"
            id="estoque"
            className="w-full p-2 border border-gray-300 rounded"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="foto">
            Foto do Produto
          </label>
          <input
            type="file"
            id="foto"
            accept="foto/*"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={handleFotoChange}
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            className="bg-blue-500 text-white p-2 rounded"
            onClick={salvarEdicao}
          >
            Salvar
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white p-2 rounded"
            onClick={() => setProdutoEditando(null)} // Fecha o modal
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      <Footer />
    </div>
  );
}
