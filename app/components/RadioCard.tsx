import React from "react";
import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import { InferSelectModel } from "drizzle-orm";
import { radioTable } from "src/db/schema";

interface RadioCardProps {
  radio: InferSelectModel<typeof radioTable>;
}

export const RadioCard: React.FC<RadioCardProps> = ({ radio }) => {
  return (
    <Link to={`/radios/${radio.id}`}>
      <motion.div
        className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        whileHover={{ scale: 1.03 }}
      >
        <div className="relative">
          <img
            src={JSON.parse(radio.images || "")[0]}
            alt={radio.name || "Radio Vintage"}
            width={400}
            height={300}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-stone-800">
            {radio.name}
          </h3>
          <div className="flex justify-between items-center mb-3">
            <p className="text-2xl font-bold text-primary">
              {" "}
              {Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format((radio.price || 0) / 100)}
            </p>
          </div>
          <ul>
            {JSON.parse(radio.features || "[]")?.map(
              (feature: string, index: number) => (
                <li key={index} className="text-sm text-stone-600 mb-1">
                  • {feature}
                </li>
              )
            )}
          </ul>
        </div>
      </motion.div>
    </Link>
  );
};
