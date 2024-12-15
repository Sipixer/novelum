import { LoaderFunction } from "@remix-run/cloudflare";
import { RadioCard } from "./RadioCard";
import ProductImage from "@/assets/images/IMG_0130.jpg";
import { InferSelectModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { radioTable } from "src/db/schema";
import { useLoaderData } from "@remix-run/react";

const PRODUCTS = [
  {
    name: "ClassicWave 1960",
    price: "299€",
    features: ["FM/AM", "Wi-Fi", "Bluetooth"],
    image: ProductImage,
  },
  {
    name: "VinylVibe 1975",
    price: "349€",
    features: ["Platine vinyle", "Haut-parleurs intégrés", "Bluetooth"],
    image: ProductImage,
  },
  {
    name: "SoundScape 1980",
    price: "249€",
    features: ["Radio-réveil", "Projection de l'heure", "Streaming"],
    image: ProductImage,
  },
  {
    name: "SoundScape 1980",
    price: "249€",
    features: ["Radio-réveil", "Projection de l'heure", "Streaming"],
    image: ProductImage,
  },
];

type RadioModel = InferSelectModel<typeof radioTable>;
type ProductSectionProps = {
  radios: RadioModel[];
};
export const ProductSection = ({ radios }: ProductSectionProps) => {
  return (
    <section className="py-20 bg-stone-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-stone-800">
          Nos Pépites Rétro
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {radios.map((radio) => (
            <RadioCard key={radio.id} radio={radio} />
          ))}
        </div>
      </div>
    </section>
  );
};
