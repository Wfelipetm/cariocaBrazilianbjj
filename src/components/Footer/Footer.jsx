// Footer.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css'; // Estilização customizada

function Footer() {
  return (
    <footer className="footer bg-dark-custom text-light-custom py-5">
      <div className="container text-center">
        <p>&copy; 2025 Carioca BJJ. Todos os direitos reservados.</p>
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light-custom mx-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" style={{ width: '30px', height: '30px', marginRight: '10px' }} />

          </a>

          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light-custom mx-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" style={{ width: '30px', height: '30px', marginRight: '10px' }} />

          </a>

          <a href="https://wa.me/5511998765432" target="_blank" rel="noopener noreferrer" className="text-light-custom mx-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: '30px', height: '30px', marginRight: '10px' }} />

          </a>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
