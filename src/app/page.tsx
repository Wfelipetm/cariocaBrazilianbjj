"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthProvider";
import { useRouter } from "next/navigation";
import Header from "./componetes/Header/Header";
import Footer from "./componetes/Footer/Footer";

export default function Page() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redireciona para o login se não estiver autenticado
    }
  }, [user, router]);

  if (!user) {
    return null; 
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-8 text-center">
        <h2 className="text-xl">Bem-vindo ao Carioca Brazilian!</h2>
        <p className="mt-4 text-gray-700">Aproveite a experiência com a gente.</p>
      </main>
      <Footer />
    </div>
  );
}
