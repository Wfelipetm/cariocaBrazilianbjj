"use client";

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { AuthContext } from "../../context/AuthProvider";

function Header() {
  const { user } = useContext(AuthContext); // Pegando o usuário do contexto
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const isAdmin = user?.role === "admin"; // Verifica se o usuário é admin

  useEffect(() => {
    setIsClient(true);

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDrawer = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-gray-900 w-full text-white shadow-md py-4">
      <nav className="flex items-center justify-between px-8">
        {/* Logo no canto esquerdo */}
        <Link href="/" className="flex items-center">
        <img src="/cariocabjjBranco.png" alt="Logo Carioca BJJ" className="w-20 h-20 lg:w-20 ml-3" />
        </Link>

        {/* Exibe o botão de hambúrguer apenas se o usuário for admin */}
        {isAdmin && (
          <button className="lg:hidden text-white absolute right-4 sm:mr-4" onClick={toggleDrawer}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}

        {isClient && (
          <Drawer open={menuOpen} onClose={toggleDrawer} direction="right" className="text-white">
            <div className="min-h-full p-6" style={{ backgroundColor: "#0A0E17" }}>
              {isAdmin && (
                <ul className="space-y-6">
                   <li>
                    <Link href="/professores/professores" onClick={toggleDrawer} className="block text-lg hover:text-blue-400">
                      Professores
                    </Link>
                  </li>
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
                  <li>
                    <Link href="/graduacao/grade-graduacao" onClick={toggleDrawer} className="block text-lg hover:text-blue-400">
                      Graduação
                    </Link>
                  </li>
                 
                  <li>
                    <Link href="/produtos/produto" onClick={toggleDrawer} className="block text-lg hover:text-blue-400">
                      Produtos
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </Drawer>
        )}

        <ul className="hidden lg:flex lg:space-x-6 text-lg">
          {isAdmin && (
            <>
                <li>
                <Link href="/professores/professores" className="text-white hover:text-gray-400">
                  Professores
                </Link>
              </li>
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
                <Link href="/graduacao/grade-graduacao" className="text-white hover:text-gray-400">
                  Graduação
                </Link>
              </li>
              <li>
                <Link href="/produtos/produto" className="text-white hover:text-gray-400">
                  Produtos
                </Link>
              </li>
          
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
