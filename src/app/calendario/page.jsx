import { useState } from "react";
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function Calendario() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const mensalidade = 150; // Valor da mensalidade
  const [statusPagamentos, setStatusPagamentos] = useState(Array(12).fill(false));

  const handleTogglePagamento = (index) => {
    setStatusPagamentos((prev) => {
      const newStatus = [...prev];
      newStatus[index] = !newStatus[index]; // Alterna entre Pago e Pendente
      return newStatus;
    });
  };

  return (
    <section className="flex flex-col items-center justify-center h-full p-4 lg:ml-[235px] sm:ml-[100px]">
      <h2 className="text-xl font-bold mb-4">Calendário de Pagamento</h2>

      {/* Grid responsiva com fundo cinza e scroll horizontal sem barra visível */}
      <div className="overflow-x-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  p-4 rounded-lg">
          {months.map((month, index) => (
            <div
              key={index}
              className={`flex flex-col items-start justify-between rounded-lg transition-all duration-300 
                h-48 w-full p-4
                ${statusPagamentos[index] ? "bg-green-200 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              <h1 className="text-lg font-semibold mb-1 ml-[29px]">{month}</h1>

              {/* Layout com duas colunas: uma para o ícone e outra para as informações */}
              <div className="flex w-full gap-2 pt-[-20px]">
                {/* Primeira coluna: ícone */}
                <div className="flex items-center justify-center flex-shrink-0 p-2 rounded-full w-1/4">
                  <FaCalendarAlt size={54} />
                </div>

                {/* Segunda coluna: informações (div preta que você quer aumentar e centralizar) */}
                <div className="flex flex-col justify-center items-center m-4 p-4 mt-auto pb-1 h-[95%] w-[85%] ml-1 bg-gray-300  rounded-lg">
                  {/* Valor com margem inferior para o espaçamento e negrito */}
                  <p className="text-xl font-bold text-left ml-24 mb-4">{`R$ ${mensalidade},00`}</p>

                  {/* Texto de Pago/Pendente com caixa alta, espaçamento e negrito */}
                  <p className="flex items-center gap-2 text-sm  text-center uppercase font-bold">
                    {statusPagamentos[index] ? (
                      <>
                        <FaCheckCircle className="text-green-600 ml-24" />
                        <span>Pago</span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-red-600 ml-24 " />
                        <span>Pendente</span>
                      </>
                    )}
                  </p>
                </div>

              </div>

              <div className="ml-[215px]"> {/* Ajuste o valor da margem manualmente */}
                <button
                  className={`px-6 py-2 mt-1 text-xs text-white rounded-md transition-all duration-300
        bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95 
        ${statusPagamentos[index] ? "ml-[19px]" : "ml-[-px]"}`}
                  onClick={() => handleTogglePagamento(index)}
                >
                  {statusPagamentos[index] ? "Desfazer" : "Pagar com Pix"}
                </button>
              </div>


            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
