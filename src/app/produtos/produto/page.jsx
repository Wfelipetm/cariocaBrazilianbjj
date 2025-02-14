"use client";
import { useEffect, useState } from 'react';
import Header from '../../componetes/Header/Header';  // Caminho para o Header
import Footer from '../../componetes/Footer/Footer';
import Link from 'next/link';  // Importando o Link para navegação

export default function Produto() {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
    foto: ''
  });

  // Fetch de produtos
  useEffect(() => {
    const fetchProdutos = async () => {
      const res = await fetch('http://10.200.200.62:5001/produtos/');
      const data = await res.json();
      setProdutos(data);
    };
    fetchProdutos();
  }, []);

  // Função para adicionar um novo produto
  const adicionarProduto = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", novoProduto.nome);
    formData.append("descricao", novoProduto.descricao);
    formData.append("preco", novoProduto.preco);
    formData.append("estoque", novoProduto.estoque);
    if (novoProduto.foto) formData.append("foto", novoProduto.foto);

    const res = await fetch('http://10.200.200.62:5001/produtos', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const produtoInserido = await res.json();
      setProdutos([...produtos, produtoInserido]);
      setNovoProduto({
        nome: '',
        descricao: '',
        preco: '',
        estoque: '',
        foto: ''
      });
      alert('Produto adicionado com sucesso!');  // Alerta nativo de sucesso
    } else {
      alert('Erro ao adicionar o produto!');  // Alerta nativo de erro
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto my-4 p-4">
        <h2 className="text-2xl font-bold mb-4">Adicionar Novo Produto</h2>

        {/* Formulário para inserir novo produto */}
        <form onSubmit={adicionarProduto} className="space-y-4">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome:</label>
            <input
              type="text"
              value={novoProduto.nome}
              onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição:</label>
            <input
              type="text"
              value={novoProduto.descricao}
              onChange={(e) => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço:</label>
            <input
              type="number"
              value={novoProduto.preco}
              onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Estoque:</label>
            <input
              type="number"
              value={novoProduto.estoque}
              onChange={(e) => setNovoProduto({ ...novoProduto, estoque: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto:</label>
            <div className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none ">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNovoProduto({ ...novoProduto, foto: e.target.files[0] })}
                className="hidden"
              />
              <span className="text-gray-500">Escolher arquivo</span>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => document.querySelector('input[type="file"]').click()}
              >
                Upload
              </button>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            <button type="submit" className="w-40 py-3 bg-blue-500 text-white rounded-lg">
              Adicionar Produto
            </button>

            {/* Botão para ver produtos */}
            <Link href="/produtos/loja-produto" passHref>
              <button className="w-40 py-3 bg-gray-500 text-white rounded-lg">
                Ver Produtos
              </button>
            </Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
