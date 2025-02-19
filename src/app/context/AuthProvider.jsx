"use client";

import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();
  useEffect(() => {
    console.log("Token após atualização no contexto:", token);
  }, [token]); // Vai ser disparado quando o token for atualizado

  


  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
  
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        console.log("token carregado do localStorage", storedToken); // Verifique se o token está correto aqui
      }
    } catch (error) {
      console.error("Erro ao carregar os dados do usuário:", error.message);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);
  

  const login = async (email, senha) => {
    console.log("Dados vindo do formulário:", email, senha);
  
    try {
      const response = await fetch("http://10.200.200.62:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
  
      const data = await response.json();
      console.log("Dados recebidos da API:", data);
  
      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }
  
      // Atualiza estados e localStorage corretamente
      const usuario = { ...data.usuario, role: data.usuario.role || "usuario" };
      setUser(usuario);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(usuario));
      localStorage.setItem("token", data.token);
  
      console.log("token após login", data.token); // Verifique o token após o login
      return data;
    } catch (error) {
      console.error("Erro no login:", error.message);
      throw error;
    }
  };
  

  const register = async (nome, email, senha) => {
    try {
      const response = await fetch("http://10.200.200.62:5001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        await login(email, senha);
      } else {
        throw new Error(data.error || "Erro ao registrar");
      }
    } catch (error) {
      console.error("Erro no registro:", error.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/"); // Redireciona para a home
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
