import { Layout } from "~/components/Layout";
import HeroImage from "@/assets/images/IMG_9740.jpg";
import ProductImage from "@/assets/images/IMG_0130.jpg";
import { RadioCard } from "~/components/RadioCard";
import { ContactForm } from "~/components/ContactForm";
import { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { IntroSection } from "~/components/IntroSection";
import { and, eq, desc, InferSelectModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { radioTable } from "src/db/schema";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Nos Radios Vintage - Collection Unique | Novelum" },
    {
      name: "description",
      content:
        "Parcourez notre collection de radios vintage restaurées, mêlant design rétro et fonctionnalités modernes. Chaque pièce est unique, restaurée avec passion et expertise.",
    },
    {
      property: "og:title",
      content: "Nos Radios Vintage - Collection Unique | Novelum",
    },
    {
      property: "og:description",
      content:
        "Parcourez notre collection de radios vintage restaurées, mêlant design rétro et fonctionnalités modernes. Chaque pièce est unique, restaurée avec passion et expertise.",
    },
    { property: "og:url", content: "https://novelum-radio.fr/radios" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Nos Radios Vintage - Collection Unique | Novelum",
    },
    {
      name: "twitter:description",
      content:
        "Parcourez notre collection de radios vintage restaurées, mêlant design rétro et fonctionnalités modernes. Chaque pièce est unique, restaurée avec passion et expertise.",
    },
  ];
};

export const loader: LoaderFunction = async ({ context }) => {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB);
  const radios = await db
    .select()
    .from(radioTable)
    .where(and(eq(radioTable.public, true), eq(radioTable.is_sold, false)))
    .orderBy(desc(radioTable.created_at));
  return Response.json(radios);
};
type RadioModel = InferSelectModel<typeof radioTable>;

export default function Radios() {
  const radios = useLoaderData<RadioModel[]>();
  return (
    <Layout>
      <div className="min-h-screen bg-stone-100">
        <div className="container mx-auto px-10">
          <IntroSection
            title="Envie d’un poste radio modernisé ? \n Découvrez notre collection de radios uniques et
                authentiques."
            description="Chaque radio est une pièce unique, restaurée à la main et
                équipée de technologies pour une expérience
                d'écoute inégalée."
            imageSrc={HeroImage}
            className="pt-14"
          />
          <h4 className="text-2xl font-bold text-stone-800 mt-12 mb-8">
            Nos Radios
          </h4>
          {radios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
              {radios.map((radio) => (
                <RadioCard key={radio.id} radio={radio} />
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
