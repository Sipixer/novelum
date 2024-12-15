import { Layout } from "~/components/Layout";
import Radio2 from "@/assets/images/IMG_9758.jpg";
import Radio3 from "@/assets/images/IMG_0130.jpg";
import Radio4 from "@/assets/images/IMG_9838.jpg";
import { ContactForm } from "~/components/ContactForm";
import { RadioDisplay } from "~/components/RadioDisplay";
import { ProductSection } from "~/components/ProductSection";
import { TestimonialSection } from "~/components/TestimonialSection";
import { RetroExperienceSection } from "~/components/RetroExperienceSection";
import { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { eq, InferSelectModel, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { radioTable } from "src/db/schema";

export const loader: LoaderFunction = async ({ context, params }) => {
  const { radioId } = params;
  if (!radioId) {
    throw new Error("radioId is required");
  }
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB);
  const radios = await db
    .select()
    .from(radioTable)
    .where(
      and(
        eq(radioTable.public, true),
        eq(radioTable.is_sold, false),
        eq(radioTable.id, parseInt(radioId))
      )
    );
  return Response.json(radios[0]);
};

type RadioModel = InferSelectModel<typeof radioTable>;

export default function RadioProduct() {
  const radio = useLoaderData<RadioModel>();
  return (
    <Layout>
      <RadioDisplay radio={radio} />
      <RetroExperienceSection />
      <TestimonialSection />
      {/* <ProductSection /> */}

      <ContactForm />
    </Layout>
  );
}
