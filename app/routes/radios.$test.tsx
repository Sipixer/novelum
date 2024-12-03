import { Layout } from "~/components/Layout";
import Radio2 from "@/assets/images/IMG_9758.jpg";
import Radio3 from "@/assets/images/IMG_0130.jpg";
import Radio4 from "@/assets/images/IMG_9838.jpg";
import { ContactForm } from "~/components/ContactForm";
import { RadioDisplay } from "~/components/RadioDisplay";
import { ProductSection } from "~/components/ProductSection";
import { TestimonialSection } from "~/components/TestimonialSection";
import { RetroExperienceSection } from "~/components/RetroExperienceSection";

export default function RadioProduct() {
  return (
    <Layout>
      <RadioDisplay
        images={[Radio2, Radio3, Radio4]}
        name={"Siera"}
        price={"240 €"}
        description={
          "Decouvrez la radio Siera, avec un style vintage et des fonctionnalité moderne."
        }
        features={["FM/AM", "Wi-Fi", "Bluetooth"]}
        caracteristics={`             
          Découvrez cette radio vintage entièrement rénovée, un véritable
              bijou du passé modernisé pour répondre aux besoins
              d&apos;aujourd&apos;hui. Avec son boîtier en bois d&apos;origine
              soigneusement restauré et ses boutons à l&apos;ancienne, elle
              conserve tout le charme d&apos;une époque révolue. Désormais
              équipée de la technologie Bluetooth, vous pouvez diffuser vos
              playlists favorites sans fil, tout en profitant de la chaleur
              sonore authentique de cette pièce d&apos;exception. Alliant
              élégance rétro et modernité, cette radio vintage est le parfait
              mélange entre nostalgie et innovation, idéale pour sublimer votre
              intérieur.
              `}
      />
      <RetroExperienceSection />
      <TestimonialSection />
      <ProductSection />

      <ContactForm />
    </Layout>
  );
}
