"use client";
import { useState } from "react";
import axios from "axios";

export default function Pagamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [qrCodeText, setQrCodeText] = useState(null);
  const [copied, setCopied] = useState(false);

  const handlePagamento = async () => {
    setLoading(true);
    setError(null);
    setQrCode(null);
    setQrCodeText(null);
    setCopied(false);

    try {
      const response = await axios.post("http://10.200.200.62:5001/api/payment/create-payment", { 
        transaction_amount: 30.50,
        description: "Teste api pix V2",
        payment_method_id: "pix",
        payer: {
          email: "wfelipetm@gmail.com"
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
    <section className="h-full w-full lg:ml-[600px] sm:ml-32">
      <h2 className="text-xl font-bold">Seção Pagamento</h2>
      <p className="mt-2">Escaneie o QR Code ou copie o código PIX para pagar.</p>
      
      <button 
        onClick={handlePagamento} 
        disabled={loading}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Processando..." : "Gerar QR Code PIX"}
      </button>

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
