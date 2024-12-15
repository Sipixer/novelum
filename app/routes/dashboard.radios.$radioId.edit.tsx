import { RadioForm } from "~/components/dashboard/RadioForm";
import { ActionFunctionArgs, LoaderFunction } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { RadioFormType, radioSchema } from "~/schema/radioFormSchema";
import { radioTable } from "src/db/schema";
import { useLoaderData } from "@remix-run/react";
import { eq, InferSelectModel } from "drizzle-orm";
import { useRadioHandler } from "~/hooks/use-radio-submit";
import { detectType } from "~/lib/cloudflare-utils";

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
    .where(eq(radioTable.id, parseInt(radioId)));
  return Response.json(radios[0]);
};

type RadioModel = InferSelectModel<typeof radioTable>;

export default function EditRadioPage() {
  const radio = useLoaderData<RadioModel>();
  const { handleSubmit } = useRadioHandler();

  const defaultValues = () => {
    let features = [];
    let imageUrls = [];

    try {
      features = radio.features ? JSON.parse(radio.features) : ["", "", ""];
    } catch (error) {
      console.error("Error parsing features:", error);
      features = ["", "", ""];
    }

    try {
      imageUrls = radio.images ? JSON.parse(radio.images) : [];
    } catch (error) {
      console.error("Error parsing images:", error);
      imageUrls = [];
    }

    return {
      name: radio.name || "",
      price: radio.price || 0,
      description: radio.description || "",
      features,
      caracteristics: radio.caracteristics || "",
      imageUrls, // On passe les URLs des images existantes
      public: radio.public ?? false,
    };
  };

  const onSubmit = (data: RadioFormType, images: (File | null)[]) => {
    return handleSubmit(data, images, {
      mode: "edit",
      radioId: radio.id,
      existingImages: defaultValues().imageUrls,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Modifier la radio</h1>
      <RadioForm onSubmitForm={onSubmit} defaultValues={defaultValues()} />
    </div>
  );
}

export async function action({ context, params, request }: ActionFunctionArgs) {
  const { radioId } = params;
  if (!radioId) {
    throw new Error("radioId is required");
  }

  const { env } = context.cloudflare;
  const db = drizzle(env.DB);
  const bucket = env.novelum;

  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return new Response("Content type must be application/json", {
      status: 400,
    });
  }

  const body = await request.json();
  const parsedBody = radioSchema.parse(body);

  const finalImages = [];

  // Traiter les images
  for (const image of parsedBody.images) {
    if (image.isExisting) {
      // Garder l'URL existante
      finalImages.push(image.url);
    } else {
      // Traiter la nouvelle image
      if (!image.base64) {
        return new Response("Image base64 data is missing", { status: 400 });
      }
      const base64 = image.base64.split(",")[1];
      const type = detectType(base64);

      if (!type) {
        return new Response("Type d'image non supporté", { status: 400 });
      }

      const imageArray = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const uuid = crypto.randomUUID();
      const filename = `${uuid}.${type.suffix}`;

      await bucket.put(filename, imageArray, {
        httpMetadata: { contentType: type.mimeType },
      });

      finalImages.push(`https://cdn.novelum-radio.fr/${filename}`);
    }
  }

  try {
    await db
      .update(radioTable)
      .set({
        ...parsedBody,
        features: JSON.stringify(parsedBody.features),
        images: JSON.stringify(finalImages),
      })
      .where(eq(radioTable.id, parseInt(radioId)));

    return new Response("Radio mise à jour avec succès !", { status: 200 });
  } catch (error) {
    console.error("Error updating radio:", error);
    return new Response("Erreur lors de la mise à jour de la radio", {
      status: 500,
    });
  }
}
