import { motion, useInView } from "framer-motion";
import { Bluetooth, LucideIcon, RadioIcon, WifiIcon } from "lucide-react";
import { useRef } from "react";
import FeatureImage from "@/assets/images/IMG_9758.jpg";

const FEATURE_LIST = [
  {
    icon: RadioIcon,
    title: "Design Authentique",
    description: "Chaque pièce est une œuvre d'art vintage",
  },
  {
    icon: WifiIcon,
    title: "Connectivité Moderne",
    description: "Streaming et radios en ligne à portée de main",
  },
  {
    icon: Bluetooth,
    title: "Compatibilité Universelle",
    description: "Connectez tous vos appareils sans fil",
  },
];

export const RetroExperienceSection = () => (
  <section className="py-20 bg-gradient-to-b from-stone-100 to-stone-200">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-12 text-stone-800">
        L&apos;Expérience Rétro-Futur
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src={FeatureImage}
            alt="Radio Vintage"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div>
          <ul className="space-y-6">
            {FEATURE_LIST.map((feature, index) => (
              <FeatureItem key={index} feature={feature} delay={index * 0.2} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const FeatureItem = ({
  feature,
  delay,
}: {
  feature: { title: string; description: string; icon: LucideIcon };
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "20px" });

  return (
    <motion.li
      ref={ref}
      className="flex items-start space-x-4"
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <div className="bg-white rounded-full p-3">
        <feature.icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-stone-800">
          {feature.title}
        </h3>
        <p className="text-stone-600">{feature.description}</p>
      </div>
    </motion.li>
  );
};
