import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Table, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";  // Importe o estilo do DatePicker

function PresencasPorMes() {
  const [searchParams] = useSearchParams();
  const alunoId = searchParams.get('aluno_id'); // Obtém o aluno_id da URL
  const [presencas, setPresencas] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [editando, setEditando] = useState(null); // Para controlar o estado de edição
  const [novaData, setNovaData] = useState(null); // Para armazenar a nova data da presença

  useEffect(() => {
    if (alunoId) {
      const mes = String(dataSelecionada.getMonth() + 1).padStart(2, '0');
      const ano = dataSelecionada.getFullYear();
  
      // Enviando o filtro com o mês e o ano selecionados diretamente na URL
      fetch(`http://localhost:3000/presencas/${alunoId}/mes?mes=${mes}&ano=${ano}`)
        .then(response => response.json())
        .then(data => setPresencas(data))
        .catch(err => console.error('Erro ao buscar presenças:', err));
    }
  }, [alunoId, dataSelecionada]); // Atualiza a cada mudança na data

  const handleDateChange = (date) => {
    setDataSelecionada(date);
  };

  const handleEditar = (id, dataCheckin) => {
    setEditando(id); // Define qual presença estamos editando
    setNovaData(new Date(dataCheckin)); // Define a data original da presença
  };

  const handleSalvarEdicao = (id) => {
    const mes = String(novaData.getMonth() + 1).padStart(2, '0');
    const ano = novaData.getFullYear();
  
    // Formatar a data no formato que você deseja, por exemplo, "yyyy-MM-dd"
    const dataPresenca = `${novaData.getFullYear()}-${String(novaData.getMonth() + 1).padStart(2, '0')}-${String(novaData.getDate()).padStart(2, '0')}`;
  
    // Enviar requisição PUT para atualizar a presença
    fetch(`http://localhost:3000/presencas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aluno_id: alunoId,
        data_presenca: dataPresenca,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Presença atualizada:', data);
        setPresencas(prevPresencas => 
          prevPresencas.map(p =>
            p.id === id ? { ...p, data_checkin: dataPresenca } : p
          )
        );
        setEditando(null); // Limpa o estado de edição
      })
      .catch(err => console.error('Erro ao atualizar presença:', err));
  };
  

  const handleExcluir = (id) => {
    // Enviar requisição DELETE para excluir a presença
    fetch(`http://localhost:3000/presencas/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Presença excluída:', data);
        setPresencas(prevPresencas => 
          prevPresencas.filter(p => p.id !== id)
        );
      })
      .catch(err => console.error('Erro ao excluir presença:', err));
  };

  return (
    <div className="container mt-4">
      <h2>Presenças do Aluno {alunoId}</h2>

      {/* Formulário para selecionar a data */}
      <Form inline className="my-4">
        <Form.Group>
          <Form.Label>Mês e Ano:</Form.Label>
          <DatePicker
            selected={dataSelecionada}
            onChange={handleDateChange}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="ml-2"
          />
        </Form.Group>
      </Form>

      {/* Tabela de presenças */}
      {presencas.length > 0 ? (
        <Table bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Data</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {presencas.map(p => (
              <tr key={p.id}>
                <td>
                  {editando === p.id ? (
                    <DatePicker
                      selected={novaData}
                      onChange={setNovaData}
                      dateFormat="dd/MM/yyyy"
                    />
                  ) : (
                    new Date(p.data_checkin).toLocaleDateString('pt-BR')
                  )}
                </td>
                <td>{p.nome_aluno}</td>
                <td>
                  {editando === p.id ? (
                    <>
                      <Button variant="success" onClick={() => handleSalvarEdicao(p.id)} className="mr-2">
                        Salvar
                      </Button>
                      <Button variant="secondary" onClick={() => setEditando(null)}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="warning" onClick={() => handleEditar(p.id, p.data_checkin)} className="mr-2">
                        Editar
                      </Button>
                      <Button variant="danger" onClick={() => handleExcluir(p.id)}>
                        Excluir
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Nenhuma presença encontrada para o aluno.</p>
      )}

      <button onClick={() => window.history.back()} className="btn btn-secondary">
        Voltar
      </button>
    </div>
  );
}

export default PresencasPorMes;
