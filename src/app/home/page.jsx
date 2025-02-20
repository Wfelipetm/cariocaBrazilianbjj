import { useState } from "react";
import Sidebar from "../componetes/sidebar/Sidebar";
import Perfil from "../perfil/page";
import Calendario from "../calendario/page";
import Pagamento from "../pagamento/page";

export default function Home() {
    const [activeSection, setActiveSection] = useState(null);

    const handleNavigate = (section) => {
        setActiveSection(section); // Muda a seção ativa com base no clique do usuário
    };

    return (
        <div className="h-full w-full flex">
            <Sidebar onNavigate={handleNavigate} /> {/* Passa o callback para o Sidebar */}

            <div
  className={`flex-grow transition-all duration-300
    ${activeSection === "perfil" ? "ml-0 sm:ml-[-20px] lg:ml-[-1000px]" : ""}
    ${activeSection === "calendario" ? "ml-0 sm:ml-[-40px] lg:ml-[-250px]" : ""}
    ${activeSection === "pagamento" ? "ml-0 sm:ml-[-60px] lg:ml-[-100px]" : ""}`}
>
    {activeSection === "perfil" && <Perfil />}
    {activeSection === "calendario" && <Calendario />}
    {activeSection === "pagamento" && <Pagamento />}

    {!activeSection && (
        <div className="flex flex-col items-center justify-center h-full p-4 lg:ml-[-100px] sm:ml-[100px]">
            <h2 className="text-xl font-bold">Bem-vindo!</h2>
            <p>Clique em um dos ícones para exibir uma seção.</p>
        </div>
    )}
</div>

        </div>
    );
}
