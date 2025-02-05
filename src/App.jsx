
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Alunos from './pages/Aluno/Alunos';
import ListaAlunos from './pages/Aluno/ListaAlunos';
import Presencas from './pages/Presenca/Presencas';
import Graduacao from './pages/Graduacao';
import Modalidades from './pages/Modalidades';
import Horarios from './pages/Horarios';
import Planos from './pages/Planos';
import Financeiro from './pages/Financeiro';
import Produtos from './pages/Produtos';
import Professores from './pages/Professores';
import Footer from './components/Footer/Footer';
import PresencasPorMes from '../src/pages/Presenca/PresencasPorMes';

function App() {
  return (
    <Router>
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="/alunos" replace />} />
          <Route path="/alunos" element={<Alunos />} />
          <Route path='/listaalunos' element= {<ListaAlunos/>} />
          <Route path="/presencas" element={<Presencas />} />
          <Route path="/presencas-por-mes" element={<PresencasPorMes />} />
          <Route path="/graduacao" element={<Graduacao />} />
          <Route path="/modalidades" element={<Modalidades />} />
          <Route path="/horarios" element={<Horarios />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/professores" element={<Professores />} />
        </Routes>
      </div>
      <Footer />
    </div>
  </Router>
    
  );
}

export default App;
