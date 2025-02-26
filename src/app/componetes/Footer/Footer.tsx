import { FC, useContext } from "react";
import { AuthContext } from "../../context/AuthProvider"; // ajuste o caminho se necessário
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer: FC = () => {
  const { user } = useContext(AuthContext);
  
  const paddingClass = user?.role === "admin" ? "py-14" : "py-5";

  return (
    <footer className={`bg-gray-900 text-white ${paddingClass}`}>
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Carioca BJJ. Todos os direitos reservados.</p>
        {user?.role !== "admin" && (
          <div className="flex justify-center mt-4 text-2xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-3 hover:text-blue-500"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-3 hover:text-pink-500"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/5511998765432"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-3 hover:text-green-500"
            >
              <FaWhatsapp />
            </a>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
