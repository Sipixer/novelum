import type { MetaFunction } from "@remix-run/cloudflare";
import { Layout } from "~/components/Layout";
import { HeroSection } from "~/components/HeroSection";
import { ProductSection } from "~/components/ProductSection";
import { RetroExperienceSection } from "~/components/RetroExperienceSection";
import { CTASection } from "~/components/CTASection";
import { TestimonialSection } from "~/components/TestimonialSection";
import { ContactForm } from "~/components/ContactForm";

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

export default function Index() {
  return (
    <Layout className="flex-grow">
      <HeroSection />
      <ProductSection />
      <RetroExperienceSection />
      <CTASection />
      <TestimonialSection />
      <ContactForm />
    </Layout>
  );
}
