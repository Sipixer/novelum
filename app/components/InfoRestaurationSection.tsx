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
    <div
      ref={ref}
      className={`grid grid-cols-1 md:grid-cols-2 items-center gap-6 px-6 sm:px-8 md:px-12 lg:px-20 py-8 ${
        reversed ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Partie gauche (Texte et bouton) */}
      <motion.div
        className={`flex flex-col justify-center space-y-6 text-center md:text-left ${
          reversed ? "md:order-last" : ""
        }`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h4
          className="text-xl sm:text-2xl font-bold text-stone-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          {title}
        </motion.h4>
        <motion.p
          className="text-sm sm:text-base text-stone-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          {description}
        </motion.p>
        {linkTo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          >
            <Link to={linkTo}>
              <Button className="text-sm sm:text-base">{linkText}</Button>
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Partie droite (Image) */}
      <motion.div
        className="flex justify-center items-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 50 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <img
          src={imageSrc}
          alt={title}
          className="w-full max-w-xs sm:max-w-md rounded-lg shadow-lg"
        />
      </motion.div>
    </div>
  );
};
