import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export const TestimonialSection = ({
  TESTIMONIALS,
}: {
  TESTIMONIALS: { name: string; comment: string }[];
}) => {
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
      <p className="text-stone-600 mb-4">&quot;{testimonial.comment}&quot;</p>
      <p className="font-semibold text-red-600">{testimonial.name}</p>
    </motion.div>
  );
};
