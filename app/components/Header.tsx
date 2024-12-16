import { Link } from "@remix-run/react";
import { useState } from "react";
import { Button } from "./ui/button";

export const links = [
  {
    to: "/",
    text: "Accueil",
  },
  {
    to: "/radios",
    text: "Nos Radios",
  },
  {
    to: "/about",
    text: "À Propos",
  },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 w-full z-50 bg-stone-100/90 backdrop-blur-sm shadow-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 hover:text-stone-400"
        >
          <span className="text-3xl font-bold">Novelum</span>
        </Link>

        {/* Desktop Menu + CTA */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex xl:space-x-6 space-x-4">
            {links.map((item) => (
              <li key={item.text}>
                <Link
                  to={item.to}
                  className="text-stone-700 hover:text-stone-400 transition-colors"
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/moderniser">
            <Button>Moderniser votre radio</Button>
          </Link>
        </div>

        {/* Burger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none hover:bg-stone-200"
          aria-label="Toggle menu"
        >
          <span className="sr-only">Ouvrir le menu</span>
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-stone-700"></span>
            <span className="block w-6 h-0.5 bg-stone-700"></span>
            <span className="block w-6 h-0.5 bg-stone-700"></span>
          </div>
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-stone-100 shadow-md md:hidden">
            <ul className="flex flex-col space-y-4 p-4">
              {links.map((item) => (
                <li key={item.text}>
                  <Link
                    to={item.to}
                    className="block text-stone-700 hover:text-stone-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)} // Close menu on click
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
              {/* CTA in Mobile Menu */}
              <li>
                <Link
                  to="/moderniser"
                  onClick={() => setIsMenuOpen(false)} // Close menu on click
                >
                  <Button className="w-full">Moderniser votre radio</Button>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};
