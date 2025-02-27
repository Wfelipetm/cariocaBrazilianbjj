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
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [qrCodeText, setQrCodeText] = useState('');
  const [copied, setCopied] = useState(false);
  const [datasPagamentos, setDatasPagamentos] = useState(Array(12).fill(""));
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
        const response = await fetch(`http://10.200.200.62:5001/financeiro/${user.id}`);
        const pagamentos = await response.json();

        // Verifique o que foi retornado na resposta
        console.log("Pagamentos recebidos:", pagamentos);
        const pagamentosPorMes = Array(12).fill(0);
        const statusMap = Array(12).fill(false);
        const datasMap = Array(12).fill(""); // Array para armazenar as datas de vencimento

        pagamentos.forEach((pagamento) => {
          const dataPagamento = new Date(pagamento.data_pagamento); // Data de vencimento do pagamento
          // Ajusta para o horário local e corrige a data
          const diaCorrigido = new Date(dataPagamento.getTime() + dataPagamento.getTimezoneOffset() * 60000);

          const mes = diaCorrigido.getMonth();

          // Soma o valor de cada pagamento para o mês correspondente
          pagamentosPorMes[mes] += pagamento.valor;

          // Atualiza o status como pago ou não
          statusMap[mes] = pagamento.status_pagamento === "PAGO";

          // Armazena a data corrigida no formato desejado
          if (!datasMap[mes]) {
            datasMap[mes] = diaCorrigido.toLocaleDateString("pt-BR"); // Formato dd/mm/aaaa
          }
        });

        setValoresPagamentos(pagamentosPorMes); // Atualiza os valores totais por mês
        setStatusPagamentos(statusMap); // Atualiza os status dos pagamentos por mês
        setDatasPagamentos(datasMap); // Atualiza as datas dos pagamentos

      } catch (error) {
        console.error("Erro ao buscar pagamentos:", error);
      }
    }

    fetchAluno();
    fetchPagamentos();
  }, [user.id]); // Certifique-se de que o useEffect depende apenas de 'user.id'

  const handlePagamentoPix = async (index) => {
    try {
      setLoading(true);
      setError(null);
      setQrCode(null);
      setQrCodeText(null);

      const valor = valoresPagamentos[index]; // Obtém o valor do pagamento do mês selecionado

      if (!valor || isNaN(parseFloat(valor))) {
        setError("Valor inválido para pagamento.");
        return;
      }

      const response = await fetch("http://10.200.200.62:5001/api/payment/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_amount: parseFloat(valor),
          description: `Pagamento do mês de ${months[index]}`,
          payment_method_id: "pix",
          payer: { email: user.email }
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error("Erro ao iniciar pagamento.");

      setQrCode(data.qr_code_base64);
      setQrCodeText(data.qr_code);

    } catch (error) {
      console.error(error);
      setError("Erro ao processar pagamento.");
    } finally {
      setLoading(false);
    }
  };

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
                      className="px-6 py-2 text-xs text-white rounded-md bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95"
                      onClick={() => handlePagamentoPix(index)}
                    >
                      {statusPagamentos[index] ? "Pago" : "Pagar com Pix"}
                    </button>

                  </div>
                </div>
                {qrCode && (
                  <div className="mt-4 flex flex-col items-center">
                    <p className="text-white mb-2">Escaneie o QR Code para pagar:</p>
                    <img src={`data:image/png;base64,${qrCode}`} alt="QR Code Pix" className="w-48 h-48" />
                    <button
                      className="mt-2 px-4 py-2 text-white bg-green-600 rounded-md"
                      onClick={() => {
                        navigator.clipboard.writeText(qrCodeText);
                        setCopied(true);
                      }}
                    >
                      {copied ? "Copiado!" : "Copiar Código Pix"}
                    </button>
                  </div>
                )}

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
                      <p className="text-sm mt-1 text-center">{`Vencimento: ${datasPagamentos[index] || "Não informado"}`}</p>

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
