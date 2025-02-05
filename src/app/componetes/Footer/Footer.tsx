import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-5">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Carioca BJJ. Todos os direitos reservados.</p>
        <div className="flex justify-center mt-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-3"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
              alt="Facebook"
              className="w-8 h-8"
            />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-3"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
              alt="Instagram"
              className="w-8 h-8"
            />
          </a>

          <a
            href="https://wa.me/5511998765432"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-3"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              className="w-8 h-8"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
