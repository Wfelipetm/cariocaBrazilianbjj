"use client";
import { useState } from 'react';
import axios from 'axios';

export default function Pagamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePagamento = async () => {
    setLoading(true);
    setError(null);

    try {
      // Os valores abaixo são exemplos; em um cenário real, esses dados virão da aplicação.
      const response = await axios.post('http://10.200.200.62:5001/mercadopago/pagamento', { 
        aluno_id: 1, 
        valor: 100.0 
      });

      const { init_point } = response.data;
      // Redireciona para a página de pagamento do Mercado Pago
      window.location.href = init_point;
    } catch (err) {
      console.error(err);
      setError('Erro ao iniciar o pagamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-full w-full lg:ml-[600px] sm:ml-32">
      <h2 className="text-xl font-bold">Seção Pagamento</h2>
      <p className="mt-2">Conteúdo da seção de Pagamento.</p>
      <button 
        onClick={handlePagamento} 
        disabled={loading}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        {loading ? 'Processando...' : 'Pagar com PIX'}
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </section>
  );
}
