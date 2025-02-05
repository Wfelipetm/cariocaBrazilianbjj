"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Garante que o Drawer só será renderizado no lado do cliente
  useEffect(() => {
    setIsClient(true);

    // Função para verificar a largura da tela
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // Considera 1024px como breakpoint para desktop
        setMenuOpen(false); // Fecha o Drawer no desktop
      }
    };

    // Escuta as mudanças de tamanho da tela
    window.addEventListener("resize", handleResize);

    // Chama a função para definir o estado inicial
    handleResize();

    // Cleanup ao desmontar o componente
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDrawer = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-gray-900 text-white shadow-md py-4">
      <nav className="flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/cariocabjj.png" alt="Logo" className="w-20 lg:w-24" />
        </Link>

        {/* Botão do menu mobile - Colocado no final da linha */}
        <button
          className="lg:hidden text-white absolute right-4"
          onClick={toggleDrawer}
          aria-expanded={menuOpen ? "true" : "false"}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Drawer Menu - Renderizado apenas no cliente */}
        {isClient && (
          <Drawer
            open={menuOpen}
            onClose={toggleDrawer}
            direction="right"
            className="text-white"
            style={{ height: "88vh" }}  // Altere o valor para o que você preferir
          >
            {/* Estilização do Drawer com paleta azul */}
            <div className="min-h-full p-6" style={{ backgroundColor: '#0A0E17' }}>


              <div className="text-center mb-8">
           
          
              </div>
              <ul className="space-y-6">
                <li>
                  <Link href="/alunos" onClick={toggleDrawer} className="block text-lg hover:text-blue-400">
                    Alunos
                  </Link>
                </li>
                <li>
                  <Link href="/presenca/presencas" onClick={toggleDrawer} className="block text-lg hover:text-blue-400">
                    Presenças
                  </Link>
                </li>
                {/* <li>
                  <Link href="/graduacao" onClick={toggleDrawer} className="block text-lg hover:text-blue-400">
                    Graduação
                  </Link>
                </li>
                <li>
                  <Link href="/produtos" onClick={toggleDrawer} className="block text-lg hover:text-blue-400">
                    Produtos
                  </Link>
                </li>
                <li>
                  <Link href="/professores" onClick={toggleDrawer} className="block text-lg hover:text-blue-400">
                    Professores
                  </Link>
                </li> */}
              </ul>
            </div>
          </Drawer>
        )}

        {/* Navegação desktop */}
        <ul className="hidden lg:flex lg:space-x-6 text-lg">
          <li>
            <Link href="/alunos" className="text-white hover:text-gray-400">
              Alunos
            </Link>
          </li>
          <li>
            <Link href="/presenca/presencas" className="text-white hover:text-gray-400">
              Presenças
            </Link>
          </li>
          <li>
            <Link href="/graduacao" className="text-white hover:text-gray-400">
              Graduação
            </Link>
          </li>
          <li>
            <Link href="/produtos" className="text-white hover:text-gray-400">
              Produtos
            </Link>
          </li>
          <li>
            <Link href="/professores" className="text-white hover:text-gray-400">
              Professores
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
