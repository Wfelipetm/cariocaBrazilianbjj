import { useState, useEffect, useContext } from "react";
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider"; // Ajuste conforme o caminho do seu contexto

export default function Calendario() {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  const [aluno, setAluno] = useState(null);
  const [statusPagamentos, setStatusPagamentos] = useState(Array(12).fill(false));
  const [valoresPagamentos, setValoresPagamentos] = useState(Array(12).fill(0));
  const [datasPagamentos, setDatasPagamentos] = useState(Array(12).fill(""));
  const { user } = useContext(AuthContext);
  const [paymentId, setPaymentId] = useState(null); // Novo estado para armazenar paymentId
  // Estados para o modal do pagamento
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [qrCodeText, setQrCodeText] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [alunos, setAlunos] = useState([]); // Estado para armazenar os alunos
  const [alunoIds, setAlunoIds] = useState([]); // Estado para armazenar os aluno_ids
  
  useEffect(() => {
    console.log("user.id:", user.id); // Verifica se o user.id existe
  
    // Função para buscar os alunos
    async function fetchAluno() {
      if (user.id) {
        try {
          const response = await fetch(`http://10.200.200.62:5001/alunos/${user.id}`);
          const alunos = await response.json();
          console.log("Alunos associados ao usuário:", alunos);
          
          setAlunos(alunos); // Armazena os dados completos dos alunos no estado 'alunos'
          
          // Extrai os 'aluno_id' dos alunos e armazena no estado 'alunoIds'
          const ids = alunos.map(aluno => aluno.aluno_id);
          setAlunoIds(ids); // Atualiza o estado com os 'aluno_ids'
        } catch (error) {
          console.error("Erro ao buscar dados dos alunos:", error);
        }
      }
    }
    
    async function fetchPagamentos() {
      try {
        // Requisição para pegar os pagamentos
        const response = await fetch(`http://10.200.200.62:5001/financeiro/${user.id}`);
        let pagamentosData = await response.json();
        
        // Verificando os dados recebidos
        console.log("Resposta da API (dados brutos):", pagamentosData);
      
        if (!Array.isArray(pagamentosData)) {
          pagamentosData = [pagamentosData];
        }
      
        // Verificando a estrutura dos dados após possível transformação
        console.log("Dados convertidos para array:", pagamentosData);
      
        // Usa reduce para agrupar os pagamentos por mês, ano e dia corretamente
        const pagamentosPorDiaMesEAno = pagamentosData.reduce((acc, pagamento) => {
          // Extrai o dia, mês e ano da data de pagamento
          const [dia, mes, ano] = pagamento.data_pagamento.split("/"); // Desestruturação para separar o dia, mês e ano
          const chaveDiaMesAno = `${dia}-${mes}-${ano}`; // Cria uma chave única no formato "dd-mm-yyyy"
          
          // Converte o valor do pagamento para número e trata valores inválidos (como NaN)
          const valor = Number(pagamento.valor) || 0;
    
          console.log(`Processando pagamento para o dia ${dia}/${mes}/${ano}: valor=${valor}`);
    
          // Se a chave já existe, soma o valor, caso contrário, inicializa com o valor
          if (!acc[chaveDiaMesAno]) {
            acc[chaveDiaMesAno] = 0;
          }
          acc[chaveDiaMesAno] += valor;
    
          return acc;
        }, {});
    
        console.log("Pagamentos agrupados por dia, mês e ano:", pagamentosPorDiaMesEAno);
    
        // Agora, mapeamos os valores de pagamentos para o formato de meses e anos para exibir
        const statusMap = Array(12).fill(false);
        const datasMap = Array(12).fill("");
    
        // Iteramos sobre os pagamentos agrupados por dia, mês e ano
        Object.keys(pagamentosPorDiaMesEAno).forEach((chaveDiaMesAno) => {
          const [dia, mes, ano] = chaveDiaMesAno.split("-");
    
          // Converte o mês para índice do array (0-11)
          const mesIndex = parseInt(mes, 10) - 1;
    
          // Aqui, se o pagamento foi realizado, marcamos como pago
          const pagamento = pagamentosData.find(pagamento => pagamento.data_pagamento.includes(`${dia}/${mes}/${ano}`));
          if (pagamento && pagamento.status_pagamento === "PAGO") {
            statusMap[mesIndex] = true;
          }
    
          // Armazena a data do primeiro pagamento encontrado para esse mês
          if (!datasMap[mesIndex]) {
            datasMap[mesIndex] = `${dia}/${mes}/${ano}`;
          }
        });
    
        // Converte os valores para um array de pagamentos agrupados por dia, mês e ano
        const pagamentosPorMesArredondados = Object.values(pagamentosPorDiaMesEAno).map(valor => parseFloat(valor.toFixed(2)));
    
        console.log("Valores dos pagamentos por mês corrigidos:", pagamentosPorMesArredondados);
    
        // Atualizando os estados com os valores corrigidos
        setValoresPagamentos(pagamentosPorMesArredondados);
        setStatusPagamentos(statusMap);
        setDatasPagamentos(datasMap);
    
      } catch (error) {
        // Captura de erro
        console.error("Erro ao buscar pagamentos:", error);
      }
    }
    
    // Chama as funções de busca de alunos e pagamentos
    fetchAluno();
    fetchPagamentos();
    
    
}, [user.id]); // Dependência do user.id para refazer a chamada sempre que o user.id mudar




  // Função para atualizar o status do pagamento
  const updateStatusPagamento = (index) => {
    const newStatusPagamentos = [...statusPagamentos];
    newStatusPagamentos[index] = true; // Marca como pago
    setStatusPagamentos(newStatusPagamentos);
  };

  // Função para abrir o modal e gerar QR Code 
  const handlePagamentoPix = async (index) => {
    setSelectedMonth(index); // Marca o mês selecionado
    setModalOpen(true);
    setLoading(true);
    setError(null);
    setQrCode(null);
    setQrCodeText(null);
  
    // Obtém o valor correspondente ao mês do array valoresPagamentos
    const valor = valoresPagamentos[index];
  
    if (!valor || isNaN(parseFloat(valor))) {
      setError("Valor inválido para pagamento.");
      setLoading(false);
      return;
    }
  
    try {
      // Requisição para criar o pagamento via Pix
      const response = await fetch("http://10.200.200.62:5001/api/payment/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_amount: parseFloat(valor),  // Valor do pagamento
          description: `Pagamento do mês de ${months[index]}`,  // Descrição incluindo o mês
          payment_method_id: "pix",  // Método de pagamento
          payer: { email: user.email }  // E-mail do usuário
        }),
      });
  
      const data = await response.json();
      console.log("Resposta do pagamento via Pix:", data);
  
      if (!response.ok) throw new Error("Erro ao iniciar pagamento.");
  
      // Armazenar o ID do pagamento retornado da API
      const paymentId = data.id;
      console.log("ID do pagamento:", paymentId);
  
      setQrCode(data.qr_code_base64);  // Define o código QR recebido
      setQrCodeText(data.qr_code);     // Define o texto do código QR
  
      // Armazenar o paymentId no estado para ser usado no webhook
      setPaymentId(paymentId);
  
      // Chame a função handlePaymentWebhook com o paymentId
      handlePaymentWebhook(paymentId);
  
    } catch (error) {
      console.error(error);
      setError("Erro ao processar pagamento.");
    } finally {
      setLoading(false);
    }
  };
  



  const handlePaymentWebhook = async (paymentId) => {
    try {
      const requestBody = {
        id: paymentId, // ID do pagamento
        type: "payment", // Tipo de evento (sempre "payment")
      };
      console.log("Enviando requisição com o corpo:", requestBody);

      const response = await fetch("http://10.200.200.62:5001/api/payment/eventos/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error("Erro na resposta da requisição:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Resposta recebida:", data);

      if (data.status === "approved") {
        // Pagamento aprovado, atualizar status no banco de dados
        console.log("Pagamento aprovado, atualizando status...");
        await atualizarStatusPagamento(user.id);  // Atualizando o status para "PAGO"
      } else if (data.status === "pending") {
        // Pagamento pendente, continuar tentando
        console.log("Status do pagamento é pending. Tentando novamente...");
        updateStatusPagamento(selectedMonth);
      }
    } catch (error) {
      console.error("Erro ao processar webhook:", error);
    }
  };


  const atualizarStatusPagamento = async (userId) => {
    try {
      const response = await fetch(`http://10.200.200.62:5001/financeiro/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status_pagamento: "PAGO",  // Atualizando o status para "PAGO"
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar status do pagamento.");
      }

      const data = await response.json();
      console.log("Status de pagamento atualizado:", data);
    } catch (error) {
      console.error("Erro ao atualizar status do pagamento:", error);
    }
  };


  useEffect(() => {
    if (paymentId) {
      const intervalId = setInterval(() => {
        handlePaymentWebhook(paymentId); // Passando o paymentId correto
      }, 2000); // 2000 ms = 2 segundos

      return () => clearInterval(intervalId); // Limpar intervalo quando paymentId mudar
    }
  }, [paymentId]);




  return (
    <section className="flex flex-col items-center justify-center h-full p-4 lg:ml-[235px] sm:ml-[100px]">
      <h2 className="text-xl font-bold mb-4">{`Calendário de Pagamento - ${user.nome}`}</h2>

      <div className="overflow-x-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 rounded-lg">
          {months.map((month, index) => (
            <div
              key={index}
              className={`flex flex-col items-start justify-between rounded-lg transition-all duration-300
              ${statusPagamentos[index] ? "bg-green-600" : "bg-gray-900"}
              overflow-hidden w-full p-4`}
            >
              <div className="w-full flex flex-row gap-x-5">
                <div className="flex items-center justify-center rounded-full flex-col p-2">
                  <h1 className="text-lg font-semibold mb-1 text-white">{month}</h1>
                  <FaCalendarAlt size={54} className="text-white" />
                  <div className="w-full mt-2 flex justify-center">
                    <button
                      className="px-6 py-2 text-xs text-white rounded-md bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95"
                      onClick={() => handlePagamentoPix(index)}
                    >
                      {statusPagamentos[index] ? "Pago" : "Pagar com Pix"}
                    </button>
                  </div>
                </div>
                <div className="flex w-full gap-4">
                  <div className="flex flex-row justify-center items-center flex-grow p-4 bg-white/70 border-4 border-white rounded-lg">
                    <div>
                      <p className="text-xl font-bold text-center">{`R$ ${valoresPagamentos[index]}`}</p>
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

      {/* Modal de pagamento */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-2">{`Pagamento do mês de ${months[selectedMonth]}`}</h2>
            {loading ? <p>Carregando...</p> : qrCode && (
              <>
                <img src={`data:image/png;base64,${qrCode}`} alt="QR Code Pix" className="w-48 h-48 mx-auto" />
                <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md"
                  onClick={() => {
                    navigator.clipboard.writeText(qrCodeText);
                    setCopied(true);
                  }}>
                  {copied ? "Copiado!" : "Copiar Código Pix"}
                </button>
              </>
            )}
            <button onClick={() => setModalOpen(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">Fechar</button>
          </div>
        </div>
      )}
    </section>
  );
}
