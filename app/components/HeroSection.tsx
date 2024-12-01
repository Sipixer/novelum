import { useScroll, useTransform, motion } from "framer-motion";

import { Button } from "./ui/button";
import { Link } from "@remix-run/react";
import HeroImage from "@/assets/images/IMG_9838.jpg";

export const HeroSection = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ opacity, scale }} className="absolute inset-0">
        <img
          src={HeroImage}
          alt="Collection de radios vintage"
          className="filter brightness-50 object-cover w-full h-full"
        />
      </motion.div>
      <div className="relative z-10 text-center text-white">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Revivez l&apos;âge d&apos;or de la radio
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Des radios d&apos;époque réinventées pour l&apos;ère numérique
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link to="/radios">
            <Button size="lg">Découvrir nos trésors</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
