import { Link } from "@remix-run/react";

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
    text: "A Propos",
  },
];

export const Header = () => {
  return (
    <header className="sticky top-0 w-full z-50 bg-stone-100/90 backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to={"/"}
          className="flex items-center space-x-2 hover:text-stone-400"
        >
          <span className="text-xl font-bold">Novelum</span>
        </Link>
        <ul className="flex xl:space-x-6 space-x-2">
          {links.map((item) => (
            <li key={item.text}>
              <Link
                to={item.to}
                className="text-stone-700 hover:text-stone-400  transition-colors"
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
