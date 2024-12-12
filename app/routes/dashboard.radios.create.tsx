import { RadioForm } from "~/components/dashboard/RadioForm";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { RadioFormType, radioSchema } from "~/schema/radioFormSchema";
import { radioTable } from "src/db/schema";
import { toast } from "sonner";
import { detectType } from "~/lib/cloudflare-utils";

export default function Dashboard() {
  const onSubmit = async (data: RadioFormType, images: File[]) => {
    console.log(data);
    console.log("Images:", images);

    // Transformation des images en base64
    const base64Images = await Promise.all(
      images.map(async (image) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        return new Promise<string>((resolve) => {
          reader.onload = () => {
            resolve(reader.result as string);
          };
        });
      })
    );

    try {
      const response = await fetch("/dashboard/radios/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          images: base64Images, // Envoi des images en base64
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'insertion");
      }

      toast.success("Radio insérée avec succès !");
    } catch (error) {
      toast.error(`Erreur: ${error}`);
    }
  };

  return (
    <div>
      <RadioForm onSubmitForm={onSubmit} />
    </div>
  );
}

export async function action({ context, request }: ActionFunctionArgs) {
  const { env } = context.cloudflare;
  const db = drizzle(env.DB);

  let body;
  const contentType = request.headers.get("content-type");
  // Vérification du type de contenu
  if (contentType === null) {
    return new Response("No body to parse", { status: 400 });
  }

  if (contentType.includes("application/json")) {
    body = await request.json();
  }

  const parsedBody = radioSchema.parse(body);

  // Récupération de la bucket R2
  const bucket = env.novelum;
  const newImage = [];

  for (const image of parsedBody.images) {
    const base64 = image.split(",")[1];
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
    newImage.push(`https://cdn.novelum-radio.fr/${filename}`);
  }
  try {
    // Enregistrer les informations dans la base de données
    const result = await db.insert(radioTable).values({
      name: parsedBody.name,
      price: parsedBody.price,
      caracteristics: parsedBody.caracteristics,
      description: parsedBody.description,
      features: JSON.stringify(parsedBody.features),
      images: JSON.stringify(newImage),
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
