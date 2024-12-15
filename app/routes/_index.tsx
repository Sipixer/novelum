import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { Layout } from "~/components/Layout";
import { HeroSection } from "~/components/HeroSection";
import { ProductSection } from "~/components/ProductSection";
import { RetroExperienceSection } from "~/components/RetroExperienceSection";
import { CTASection } from "~/components/CTASection";
import { TestimonialSection } from "~/components/TestimonialSection";
import { ContactForm } from "~/components/ContactForm";
import { and, asc, desc, eq, InferSelectModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { radioTable } from "src/db/schema";
import { useLoaderData } from "@remix-run/react";

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

export const loader: LoaderFunction = async ({ context }) => {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB);
  const radios = await db
    .select()
    .from(radioTable)
    .where(and(eq(radioTable.public, true), eq(radioTable.is_sold, false)))
    .orderBy(desc(radioTable.created_at))
    .limit(4);
  return Response.json(radios);
};
type RadioModel = InferSelectModel<typeof radioTable>;

export default function Index() {
  const radios = useLoaderData<RadioModel[]>();
  return (
    <Layout className="flex-grow">
      <HeroSection />
      <ProductSection radios={radios} />
      <RetroExperienceSection />
      <CTASection />
      <TestimonialSection />
      <ContactForm />
    </Layout>
  );
}
