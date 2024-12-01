import { Link } from "@remix-run/react";
import { links } from "./Header";

const socials = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/novelum_/",
  },
];

export const Footer = () => {
  return (
    <footer className="bg-stone-800 text-stone-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Novelum Radio</h3>
            <p>Redonnons vie aux classiques, un son à la fois.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.text}>
                  <Link
                    to={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-400 transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Nous contacter</h3>
            <a href="mailto:novelum.radio@gmail.com">novelum.radio@gmail.com</a>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              {socials.map((social) => (
                <Link
                  key={social.name}
                  to={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-red-400"
                >
                  {social.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-stone-700 text-center">
          <p>©{new Date().getFullYear()} Novelum. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
