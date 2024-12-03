import { RadioForm } from "~/components/dashboard/RadioForm";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { RadioFormType, radioSchema } from "~/schema/radioFormSchema";
import { radioTable } from "src/db/schema";
import { toast } from "sonner";

export default function Dahboard() {
  const onSubmit = async (data: RadioFormType, images: File[]) => {
    console.log(data);
    console.log("Images:", images);
    //transform image to base64 liste
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
    const promise = fetch("/dashboard/radios/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        images: base64Images,
      }),
    });
    toast.promise(promise, {
      loading: "Loading...",
      success: () => {
        return "Radio insérée avec succès !";
      },
      error: (error) => {
        return `Erreur lors de l'insertion de la radio: ${error}`;
      },
    });
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
  if (contentType === null) {
    return new Response("No body to parse", {
      headers: {
        "Content-Type": "text/plain",
      },
      status: 400,
    });
  }
  if (contentType.includes("application/json")) {
    body = await request.json();
  }
  const parsedBody = radioSchema.parse(body);
  const bucket = env.novelum;
  const newImages = [];

  for (const image of parsedBody.images) {
    try {
      // Générer un UUID pour chaque image
      const uuid = crypto.randomUUID();
      const filename = `${uuid}.png`;

      // Vérification que l'image est bien au format base64 ou binaire
      let imageBuffer;
      if (image.startsWith("data:image/png;base64,")) {
        // Si l'image est en base64, on la convertit en buffer
        const base64Data = image.replace("data:image/png;base64,", "");
        imageBuffer = Buffer.from(base64Data, "base64");
      } else {
        // Si l'image est déjà un buffer, on l'utilise tel quel
        imageBuffer = image; // Assumes image is already a Buffer
      }

      // Téléverser l'image dans le bucket R2
      await bucket.put(filename, imageBuffer, {
        httpMetadata: {
          contentType: "image/png", // Vérifie que c'est bien du PNG
        },
      });

      newImages.push(filename);
    } catch (error) {
      console.error("Error uploading image:", error);
      // Optionnel : Continuer avec les autres images ou arrêter
      throw new Error("Image upload failed, aborting.");
    }
  }

  // Enregistrement dans la base de données
  const result = await db.insert(radioTable).values({
    name: parsedBody.name,
    price: parsedBody.price,
    caracteristics: parsedBody.caracteristics,
    description: parsedBody.description,
    features: JSON.stringify(parsedBody.features),
    images: JSON.stringify(newImages),
  });

  if (result.success)
    return new Response(" Radio insérés avec succès !", {
      headers: {
        "Content-Type": "text/plain",
      },
    });

  return new Response("Erreur lors de l'insertion de la radio.", {
    headers: {
      "Content-Type": "text/plain",
    },
    status: 500,
  });
}
