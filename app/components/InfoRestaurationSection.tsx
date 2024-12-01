import { Link } from "@remix-run/react";
import { Button } from "./ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type InfoSectionProps = {
  title: string;
  description: string;
  imageSrc: string;
  linkText?: string;
  linkTo?: string;
  reversed?: boolean;
};

export const InfoRestaurationSection = ({
  title,
  description,
  imageSrc,
  linkText,
  linkTo = "/radios",
  reversed,
}: InfoSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "20px" });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 px-10 gap-8" ref={ref}>
      {/* Partie gauche (Texte et bouton) */}
      <motion.div
        className={`flex flex-col h-full justify-between ${
          reversed && "col-start-2"
        }`}
        initial={{ opacity: 0, y: 50 }} // Position initiale hors de la vue
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }} // Animation à l'entrée dans la vue
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div>
          <motion.h4
            className="text-2xl font-bold text-stone-800 mt-12 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            {title}
          </motion.h4>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            {description}
          </motion.p>
        </div>
        {linkTo && (
          <Link to={linkTo} className="self-start mt-auto mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            >
              <Button>{linkText}</Button>
            </motion.div>
          </Link>
        )}
      </motion.div>

      {/* Partie droite (Image) */}
      <motion.img
        src={imageSrc}
        alt={title}
        className={`rounded-lg shadow-lg max-h-72 ${
          reversed && "col-start-1 row-start-1"
        }`}
        initial={{ opacity: 0, x: 50 }} // L'image commence décalée à droite
        animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 50 }} // L'image glisse à sa position finale
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  );
};
