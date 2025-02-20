"use client";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";

export default function Pagamento() {
  const { user } = useContext(AuthContext); // Obtendo usuário do contexto
  const [amount, setAmount] = useState(""); // Estado para o valor do pagamento
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [qrCodeText, setQrCodeText] = useState(null);
  const [copied, setCopied] = useState(false);

  const handlePagamento = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setError("Digite um valor válido para o pagamento.");
      return;
    }

    setLoading(true);
    setError(null);
    setQrCode(null);
    setQrCodeText(null);
    setCopied(false);

    try {
      const response = await axios.post("http://10.200.200.62:5001/api/payment/create-payment", { 
        transaction_amount: parseFloat(amount),
        description: "Pagamento via PIX",
        payment_method_id: "pix",
        payer: {
          email: user?.email || "email@padrao.com" // Usa o email do usuário ou um padrão
        }
      });

      const { qr_code_base64, qr_code } = response.data;
      setQrCode(qr_code_base64);
      setQrCodeText(qr_code);
    } catch (err) {
      console.error(err);
      setError("Erro ao iniciar o pagamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPix = () => {
    if (qrCodeText) {
      navigator.clipboard.writeText(qrCodeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-full p-4 lg:ml-[100px] sm:ml-[100px]">
      <h2 className="text-xl h-20 font-bold">Seção Pagamento</h2>
     

      {/* Input para definir o valor do pagamento */}
    <div  className="flex items-center gap-4 mt-4">
    <input 
        type="number"
        placeholder="Digite o valor (R$)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mt-4 p-2 border rounded w-auto"
      />

      <button 
        onClick={handlePagamento} 
        disabled={loading}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Processando..." : "Gerar QR Code PIX"}
      </button>
    </div>

      {qrCode && (
        <div className="mt-4 flex flex-col items-center">
          <img src={`data:image/png;base64,${qrCode}`} alt="QR Code PIX" className="w-64 h-64" />
        </div>
      )}

      {qrCodeText && (
        <div className="mt-4 p-2 border rounded bg-gray-100 flex items-center">
          <p className="text-sm break-all">{qrCodeText}</p>
          <button 
            onClick={handleCopyPix} 
            className="ml-2 bg-green-500 text-white p-1 rounded text-sm"
          >
            {copied ? "Copiado!" : "Copiar PIX"}
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-red-500">{error}</p>}
    </section>
  );
}
