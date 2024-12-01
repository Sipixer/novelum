import type { MetaFunction } from "@remix-run/cloudflare";
import { Layout } from "~/components/Layout";
import ProductImage from "@/assets/images/IMG_0130.jpg";
import { Bluetooth, RadioIcon, WifiIcon } from "lucide-react";
import { HeroSection } from "~/components/HeroSection";
import { ProductSection } from "~/components/ProductSection";
import { RetroExperienceSection } from "~/components/RetroExperienceSection";
import FeatureImage from "@/assets/images/IMG_9758.jpg";
import { CTASection } from "~/components/CTASection";
import { TestimonialSection } from "~/components/TestimonialSection";
import { ContactForm } from "~/components/ContactForm";
import {
  SignedIn,
  UserButton,
  SignOutButton,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/remix";

export const meta: MetaFunction = () => {
  return [
    { title: "Novelum" },
    {
      name: "description",
      content:
        "Bienvenue sur Novelum, la boutique de radios vintage réinventées pour l'ère numérique.",
    },
  ];
};

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

const TESTIMONIALS = [
  {
    name: "Marie L.",
    comment:
      "Ma ClassicWave 1960 est devenue la pièce maîtresse de mon salon. Le son est incroyable !",
  },
  {
    name: "Thomas B.",
    comment:
      "J'adore pouvoir écouter mes playlists Spotify sur une radio qui a l'air tout droit sortie des années 70.",
  },
  {
    name: "Sophie M.",
    comment:
      "Le service client est exceptionnel. Ils m'ont aidée à choisir le modèle parfait pour mon intérieur vintage.",
  },
];

export default function Index() {
  return (
    <Layout className="flex-grow">
      <HeroSection />
      <ProductSection products={PRODUCTS} />
      <RetroExperienceSection
        FEATURE_LIST={FEATURE_LIST}
        image={FeatureImage}
      />
      <CTASection />
      <TestimonialSection TESTIMONIALS={TESTIMONIALS} />
      <div>
        <h1>Index Route</h1>
        <SignedIn>
          <p>You are signed in!</p>
          <div>
            <p>View your profile here</p>
            <UserButton />
          </div>
          <div>
            <SignOutButton />
          </div>
        </SignedIn>
        <SignedOut>
          <p>You are signed out</p>
          <div>
            <SignInButton />
          </div>
          <div>
            <SignUpButton />
          </div>
        </SignedOut>
      </div>
      <ContactForm />
    </Layout>
  );
}
