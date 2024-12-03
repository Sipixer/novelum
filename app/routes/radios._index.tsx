import { Layout } from "~/components/Layout";
import HeroImage from "@/assets/images/IMG_9740.jpg";
import ProductImage from "@/assets/images/IMG_0130.jpg";
import { RadioCard } from "~/components/RadioCard";
import { ContactForm } from "~/components/ContactForm";
import { MetaFunction } from "@remix-run/cloudflare";
import { IntroSection } from "~/components/IntroSection";

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

export const meta: MetaFunction = () => {
  return [
    { title: "Novelum | Nos Radios" },
    {
      name: "description",
      content:
        "Envie d'une radio vintage réinventée pour l'ère numérique ? Découvrez notre collection de radios uniques et authentiques.",
    },
  ];
};

export default function Radios() {
  return (
    <Layout>
      <div className="min-h-screen bg-stone-100">
        <div className="container mx-auto px-10">
          <IntroSection
            title="Envie d'une radio vintage réinventée pour l'ère
                numérique ? Découvrez notre collection de radios uniques et
                authentiques."
            description="          Chaque radio est une pièce unique, restaurée à la main et
                équipée des dernières technologies pour une expérience
                d'écoute inégalée."
            imageSrc={HeroImage}
            className="pt-14"
          />
          <h4 className="text-2xl font-bold text-stone-800 mt-12 mb-8">
            Nos Radios
          </h4>
          {PRODUCTS.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
              {PRODUCTS.map((product) => (
                <RadioCard
                  key={product.name}
                  name={product.name}
                  features={product.features}
                  image={product.image}
                  price={product.price}
                />
              ))}
            </div>
          ) : (
            <p className="text-stone-800">
              Aucun produit disponible pour le moment. Revenez bientôt !
            </p>
          )}
        </div>
      </div>
      <ContactForm />
    </Layout>
  );
}
