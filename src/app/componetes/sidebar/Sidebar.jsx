"use client";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaRegCreditCard, FaUserAlt } from "react-icons/fa";

export default function Sidebar({ onNavigate }) {
    const { logout } = useContext(AuthContext);
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const handleNavigation = (section) => {
        onNavigate(section); // Chama a função recebida como prop para mudar a seção
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-full">
            {isMobile ? (
                <div className="fixed bottom-0 left-0 w-full h-32 bg-gray-800 text-white flex justify-around items-center">
                    <button onClick={() => handleNavigation("perfil")}>
                        <FaUserAlt size={40} />
                    </button>
                    <button onClick={() => handleNavigation("calendario")}>
                        <FaCalendarAlt size={40} />
                    </button>
                    <button onClick={() => handleNavigation("pagamento")}>
                        <FaRegCreditCard size={40} />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center left-0 top-0 h-full w-40 bg-gray-800 text-white py-4 relative">
                    <button onClick={() => handleNavigation("perfil")} className="absolute top-4">
                        <FaUserAlt size={40} />
                    </button>
                    <button onClick={() => handleNavigation("calendario")} className="absolute top-1/2 transform -translate-y-1/2">
                        <FaCalendarAlt size={40} />
                    </button>
                    <button onClick={() => handleNavigation("pagamento")} className="absolute bottom-4">
                        <FaRegCreditCard size={40} />
                    </button>
                </div>
            )}
        </div>
    );
}
