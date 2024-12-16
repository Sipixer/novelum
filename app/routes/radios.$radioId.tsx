import { Layout } from "~/components/Layout";
import { ContactForm } from "~/components/ContactForm";
import { RadioDisplay } from "~/components/RadioDisplay";
import { ProductSection } from "~/components/ProductSection";
import { TestimonialSection } from "~/components/TestimonialSection";
import { RetroExperienceSection } from "~/components/RetroExperienceSection";
import { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { eq, InferSelectModel, and, desc, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { radioTable } from "src/db/schema";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import Stripe from "stripe";

export const meta: MetaFunction = ({ params, data }) => {
  const loaded = data as {
    selectedRadio: RadioModel;
    lastestRadios: RadioModel[];
    sessionUrl?: string;
  };
  const radio = loaded.selectedRadio;
  const radioName = radio.name || "No name";
  return [
    { title: `${radioName} - Novelum` },
    {
      name: "description",
      content: `Découvrez tous les détails de ${radioName}, une radio vintage restaurée et modernisée, parfaite pour allier style rétro et technologies actuelles. \n ${
        radio.description
      } \n ${radio.price && `Prix : ${radio.price / 100}`}€`,
    },
    { property: "og:title", content: `${radioName} - Novelum` },
    {
      property: "og:description",
      content: `Découvrez tous les détails de ${radioName}, une radio vintage restaurée et modernisée, parfaite pour allier style rétro et technologies actuelles.`,
    },
    {
      property: "og:url",
      content: `${radio.images ? JSON.parse(radio.images)[0] : "ogImage"}`,
    },
    { property: "og:type", content: "product" },
    { property: "og:locale", content: "fr_FR" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${radioName} - Novelum` },
    {
      name: "twitter:description",
      content: `Découvrez tous les détails de ${radioName}, une radio vintage restaurée et modernisée, parfaite pour allier style rétro et technologies actuelles.`,
    },
  ];
};

export const loader: LoaderFunction = async ({ context, params, request }) => {
  const { radioId } = params;
  if (!radioId) {
    throw new Error("radioId is required");
  }
  const env = context.cloudflare.env;
  const db = drizzle(env.DB);
  const radios = await db
    .select()
    .from(radioTable)
    .where(
      and(eq(radioTable.public, true), eq(radioTable.id, parseInt(radioId)))
    );
  const selectedRadio = radios[0];

  const lastestRadios = await db
    .select()
    .from(radioTable)
    .where(
      and(
        eq(radioTable.public, true),
        eq(radioTable.is_sold, false),
        ne(radioTable.id, parseInt(radioId))
      )
    )
    .orderBy(desc(radioTable.created_at));
  if (!selectedRadio || !selectedRadio.price) {
    throw new Error("Radio not found");
  }
  if (selectedRadio.is_sold) {
    return Response.json({
      selectedRadio: selectedRadio,
      lastestRadios,
    });
  }

  const stripe = new Stripe(context.cloudflare.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: selectedRadio.name || "No name",
            description: selectedRadio.description || "No description",
            images: selectedRadio.images
              ? JSON.parse(selectedRadio.images)
              : [],
            metadata: { radioId: selectedRadio.id },
          },
          unit_amount: selectedRadio.price,
        },
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    payment_method_types: ["card", "paypal", "link", "klarna"],
    shipping_address_collection: {
      allowed_countries: ["FR"],
    },
    payment_intent_data: {
      capture_method: "manual",
    },
    mode: "payment",
    success_url: `${request.url}?status=success`,
    cancel_url: `${request.url}?status=cancel`,
  });

  return Response.json({
    selectedRadio: selectedRadio,
    lastestRadios,
    sessionUrl: session.url,
  });
};

type RadioModel = InferSelectModel<typeof radioTable>;

export default function RadioProduct() {
  const { selectedRadio, lastestRadios, sessionUrl } = useLoaderData<{
    selectedRadio: RadioModel;
    lastestRadios: RadioModel[];
    sessionUrl?: string;
  }>();
  const searchParams = useSearchParams();
  const status = searchParams[0].get("status");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "success") {
      setIsModalOpen(true);
    }
  }, [status]);
  return (
    <Layout>
      <RadioDisplay radio={selectedRadio} sessionUrl={sessionUrl} />
      <RetroExperienceSection />
      <TestimonialSection />
      <ProductSection radios={lastestRadios} />

      <ContactForm />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merci pour votre commande !</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p>
              Nous vous remercions d'avoir passé commande. Vous recevrez sous
              peu un e-mail après la validation de votre commande. Le débit sera
              effectué à ce moment-là.
            </p>
            <p>
              Nous faisons tout notre possible pour vous envoyer votre radio dès
              que possible.
            </p>
            <p>
              En cas de besoin, n'hésitez pas à nous contacter à :{" "}
              <a href="mailto:novelum.radio@gmail.com">
                novelum.radio@gmail.com
              </a>
            </p>
          </DialogDescription>
          <DialogFooter>
            <DialogClose>
              <Button>OK</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
