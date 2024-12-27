import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const TESTIMONIALS = [
  {
    name: "Marie L.",
    comment:
      "Mon ancien poste TSF est devenue la pièce maîtresse de mon salon. Le son est incroyable&nbsp;!", // Utilisation du &nbsp; sans qu'il apparaisse
  },
  {
    name: "Thomas B.",
    comment:
      "J'adore pouvoir écouter mes playlists Spotify sur une radio qui a l'air tout droit sortie des années 70&nbsp;.", // Idem ici
  },
  {
    name: "Sophie M.",
    comment:
      "Un travail d’exception, je ne pensais pas que ma radio pouvait retrouver son éclat d’antan&nbsp;😁", // &nbsp; avant l'emoji
  },
];

export const TestimonialSection = () => {
  return (
    <section className="py-20 bg-stone-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-stone-800">
          Nos clients ont la parole
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({
  testimonial,
  delay,
}: {
  testimonial: { name: string; comment: string };
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "20px" });

  return (
    <motion.div
      ref={ref}
      className="bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <p
        className="text-stone-600 mb-4"
        dangerouslySetInnerHTML={{ __html: `"${testimonial.comment}"` }} // Ceci permet d'intégrer le &nbsp; sans le rendre visible
      />
      <p className="font-semibold text-primary">{testimonial.name}</p>
    </motion.div>
  );
};
