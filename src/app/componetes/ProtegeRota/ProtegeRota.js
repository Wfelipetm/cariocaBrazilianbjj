"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext"; // Certifique-se do caminho correto

const ProtegeRota = ({ children, roleRequerido }) => {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Se não estiver logado, redireciona para a página de login
    if (!token) {
      router.push("/login");
      return;
    }

    // Se o usuário estiver logado, mas não tiver permissão, redireciona para a home
    if (roleRequerido && user?.role !== roleRequerido) {
      router.push("/");
    }
  }, [user, token, router, roleRequerido]);

  // Se o usuário não tem permissão, não renderiza a página protegida
  if (!token || (roleRequerido && user?.role !== roleRequerido)) {
    return null;
  }

  return children;
};

export default ProtegeRota;
