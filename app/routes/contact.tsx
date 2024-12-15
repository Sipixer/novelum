import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { contactFormTable } from "src/db/schema";
import { contactFormSchema } from "~/schema/contactFormSchema";

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

  const parsedBody = contactFormSchema.parse(body);
  try {
    // Enregistrer les informations dans la base de données
    const result = await db.insert(contactFormTable).values({
      email: parsedBody.email,
      message: parsedBody.message,
      location: parsedBody.location,
    });

    if (result.success) {
      return new Response("Message envoyé", { status: 200 });
    } else {
      return new Response("Erreur serveur lors de l'insertion du message.", {
        status: 500,
      });
    }
  } catch (error) {
    console.error(error);
    return new Response("Erreur serveur lors de l'insertion du message.", {
      status: 500,
    });
  }
}
