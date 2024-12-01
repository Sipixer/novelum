import React from "react";
import { motion } from "framer-motion";
import { Link } from "@remix-run/react";

interface RadioCardProps {
  name: string;
  price: string;
  image: string;
  features: string[];
}

export const RadioCard: React.FC<RadioCardProps> = ({
  name,
  price,
  image,
  features,
}) => {
  return (
    <Link to="/radios/1">
      <motion.div
        className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        whileHover={{ scale: 1.03 }}
      >
        <div className="relative">
          <img
            src={image}
            alt={name}
            width={400}
            height={300}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-stone-800">{name}</h3>
          <div className="flex justify-between items-center mb-3">
            <p className="text-2xl font-bold text-red-600">{price}</p>
          </div>
          <ul>
            {features.map((feature, index) => (
              <li key={index} className="text-sm text-stone-600 mb-1">
                • {feature}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </Link>
  );
};
