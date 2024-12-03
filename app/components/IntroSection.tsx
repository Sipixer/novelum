import { motion } from "framer-motion";
import { HTMLAttributes } from "react";

export const IntroSection = ({
  title,
  description,
  imageSrc,
  ...props
}: {
  title: string;
  description: string;
  imageSrc: string;
} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${props.className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      }}
    >
      <div className="flex flex-col gap-6 text-center md:text-left">
        <motion.h3
          className="text-2xl sm:text-3xl font-bold text-stone-800 italic"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 0.2, duration: 0.6 },
            },
          }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-base sm:text-lg text-stone-600 leading-relaxed"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 0.4, duration: 0.6 },
            },
          }}
        >
          {description}
        </motion.p>
      </div>
      <motion.div
        className="h-full"
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { delay: 0.6, duration: 0.6 },
          },
        }}
      >
        <img
          src={imageSrc}
          alt={`Section d'introduction - ${title}`}
          className="rounded-lg shadow-lg max-h-[600px] mx-auto object-cover"
        />
      </motion.div>
    </motion.div>
  );
};
