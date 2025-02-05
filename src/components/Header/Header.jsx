import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Biblioteca de ícones (pode instalar com `npm install lucide-react`)
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-dark ">
        <button className="navbar-toggler" type="button" onClick={toggleMenu} aria-controls="navbarNav" aria-expanded={menuOpen ? "true" : "false"} aria-label="Toggle navigation">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logo ao invés de 'Academia' */}
        <Link to="/" className="navbar-brand">
  <img src="src/assets/cariocabjj.png" alt="Logo" style={{ width: '100px', marginRight: '20px' }} />
  {/* <span style={{ fontSize: '1.5rem', color: 'white' }}>Carioca Brazilian </span> */}
</Link>


        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/alunos" className="nav-link" onClick={() => setMenuOpen(false)}>Alunos</Link>
            </li>
            <li className="nav-item">
              <Link to="/presencas" className="nav-link" onClick={() => setMenuOpen(false)}>Presenças</Link>
            </li>
            <li className="nav-item">
              <Link to="/graduacao" className="nav-link" onClick={() => setMenuOpen(false)}>Graduação</Link>
            </li>
            {/* <li className="nav-item">
              <Link to="/modalidades" className="nav-link" onClick={() => setMenuOpen(false)}>Modalidades</Link>
            </li> */}
            {/* <li className="nav-item">
              <Link to="/horarios" className="nav-link" onClick={() => setMenuOpen(false)}>Horários</Link>
            </li>
            <li className="nav-item">
              <Link to="/planos" className="nav-link" onClick={() => setMenuOpen(false)}>Planos</Link>
            </li>
            <li className="nav-item">
              <Link to="/financeiro" className="nav-link" onClick={() => setMenuOpen(false)}>Financeiro</Link>
            </li> */}
            <li className="nav-item">
              <Link to="/produtos" className="nav-link" onClick={() => setMenuOpen(false)}>Produtos</Link>
            </li>
            <li className="nav-item">
              <Link to="/professores" className="nav-link" onClick={() => setMenuOpen(false)}>Professores</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
