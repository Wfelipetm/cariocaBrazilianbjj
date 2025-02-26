import { useState, useEffect, useContext } from "react";
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider"; // Ajuste conforme o caminho do seu contexto

export default function Calendario() {
  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  const [aluno, setAluno] = useState(null);
  const [statusPagamentos, setStatusPagamentos] = useState(Array(12).fill(false));
  const [valoresPagamentos, setValoresPagamentos] = useState(Array(12).fill(0));

  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchAluno() {
      if (user.id) {
        try {
          const response = await fetch(`http://10.200.200.62:5001/alunos/${user.id}`);
          const data = await response.json();
          setAluno(data);
        } catch (error) {
          console.error("Erro ao buscar dados do aluno:", error);
        }
      }
    }

    async function fetchPagamentos() {
      try {
        const response = await fetch("http://10.200.200.62:5001/financeiro/");
        const pagamentos = await response.json();

        const pagamentosPorMes = Array(12).fill(0);
        const statusMap = Array(12).fill(false);

        pagamentos.forEach((pagamento) => {
          const dataPagamento = new Date(pagamento.data); // '2025-02-01T00:00:00.000Z'
const mes = dataPagamento.getUTCMonth(); // Use getUTCMonth() para evitar confusão de fuso horário
console.log(`Data de Referência: ${pagamento.data} -> Mês: ${mes} (${months[mes]})`);



          // Log para verificar a data e o mês que está sendo processado
          console.log(`Pagamento ID: ${pagamento.id}`);
          console.log(`Data de Referência: ${pagamento.data} -> Mês: ${mes} (${months[mes]})`);
          console.log(`Status do Pagamento: ${pagamento.status_pagamento}`);

          if (pagamento.status_pagamento === "PAGO") {
            pagamentosPorMes[mes] += pagamento.valor;
            statusMap[mes] = true; // Marca o mês como "Pago"
          }
        });

        setValoresPagamentos(pagamentosPorMes);
        setStatusPagamentos(statusMap); // Atualiza o status do pagamento

      } catch (error) {
        console.error("Erro ao buscar dados financeiros:", error);
      }
    }

    fetchAluno();
    fetchPagamentos();
  }, [user.id]);

  const handleTogglePagamento = async (index, pagamentoId) => {
    try {
      const novoStatus = statusPagamentos[index] ? "PENDENTE" : "PAGO";
      const updatedStatusPagamentos = [...statusPagamentos];
      updatedStatusPagamentos[index] = !updatedStatusPagamentos[index];
      setStatusPagamentos(updatedStatusPagamentos);

      const response = await fetch(`http://10.200.200.62:5001/financeiro/${pagamentoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status_pagamento: novoStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar status do pagamento");
      }

      const updatedPagamento = await response.json();
      console.log("Pagamento atualizado no backend:", updatedPagamento);

    } catch (error) {
      console.error("Erro ao atualizar status de pagamento:", error);
      setStatusPagamentos(statusPagamentos);
    }
  };

  if (!aluno) {
    return <p className="text-white">Carregando...</p>;
  }

  return (
    <section className="flex flex-col items-center justify-center h-full p-4 lg:ml-[235px] sm:ml-[100px]">
      <h2 className="text-xl font-bold mb-4">{`Calendário de Pagamento - ${user.nome}`}</h2>

      <div className="overflow-x-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 rounded-lg">
          {months.map((month, index) => (
            <div
              key={index}
              className={`flex flex-col items-start justify-between rounded-lg transition-all duration-300
              ${statusPagamentos[index] ? "bg-green-600 " : "bg-gray-900 "}
              overflow-hidden w-full p-4`}
            >
              <div className="w-full flex flex-row gap-x-5">
                <div className="flex items-center justify-center rounded-full flex-col lg:ml-[-10px] sm:ml-[-15px] p-2">
                  <h1 className="text-lg font-semibold mb-1 text-white">{month}</h1>
                  <div className="text-white">
                    <FaCalendarAlt size={54} />
                  </div>
                  <div className="w-full mt-2 flex justify-center">
                    <button
                      className="px-6 py-2 text-xs text-white rounded-md transition-all duration-300 bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95"
                      onClick={() => handleTogglePagamento(index, 58)} 
                    >
                      {statusPagamentos[index] ? "Desfazer" : "Pix"}
                    </button>
                  </div>
                </div>

                <div className="flex w-full gap-4">
                  <div className="flex flex-row justify-center items-center flex-grow p-4 bg-white/70 border-4 border-white rounded-lg lg:ml-[-10px] sm:ml-[-15px]">
                    <div>
                      <p className="text-xl font-bold text-center">{`R$ ${valoresPagamentos[index]},00`}</p>

                      <p className="flex items-center gap-2 text-sm uppercase font-bold">
                        {statusPagamentos[index] ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimesCircle className="text-red-600" />
                        )}
                        <span>{statusPagamentos[index] ? "Pago" : "Pendente"}</span>
                      </p>
                      <p className="text-sm mt-1 text-center">{`Vencimento: ${aluno.data_pagamento}`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
