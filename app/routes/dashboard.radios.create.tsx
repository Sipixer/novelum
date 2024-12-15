import { RadioForm } from "~/components/dashboard/RadioForm";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { RadioFormType, radioSchema } from "~/schema/radioFormSchema";
import { radioTable } from "src/db/schema";
import { detectType } from "~/lib/cloudflare-utils";
import { useRadioHandler } from "~/hooks/use-radio-submit";

export default function Dashboard() {
  const { handleSubmit } = useRadioHandler();

  return (
    <div>
      <RadioForm onSubmitForm={handleSubmit} />
    </div>
  );
}

export async function action({ context, request }: ActionFunctionArgs) {
  const { env } = context.cloudflare;
  const db = drizzle(env.DB);
  const bucket = env.novelum;

  const contentType = request.headers.get("content-type");
  // Vérification du type de contenu
  if (contentType === null) {
    return new Response("No body to parse", { status: 400 });
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
    // Enregistrer les informations dans la base de données
    const result = await db.insert(radioTable).values({
      ...parsedBody,
      features: JSON.stringify(parsedBody.features),
      images: JSON.stringify(finalImages),
    });

    if (result.success) {
      return new Response("Radio insérée avec succès !", { status: 200 });
    } else {
      return new Response("Erreur lors de l'insertion de la radio.", {
        status: 500,
      });
    }
  } catch (error) {
    console.error("Error inserting radio data:", error);
    return new Response("Erreur serveur lors de l'insertion de la radio.", {
      status: 500,
    });
  }
}
