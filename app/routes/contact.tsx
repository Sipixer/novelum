import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { contactFormTable } from "src/db/schema";
import { contactFormSchema } from "~/schema/contactFormSchema";

async function sendDiscordNotification(
  formData: {
    email: string;
    message: string;
    location: string;
  },
  discordWebhookUrl: string
) {
  const embed = {
    title: "Nouveau message de contact!",
    color: 0x0099ff, // Bleu
    fields: [
      {
        name: "Email",
        value: formData.email,
        inline: true,
      },
      {
        name: "Localisation",
        value: formData.location || "Non spécifiée",
        inline: true,
      },
      {
        name: "Message",
        value: formData.message.substring(0, 1024), // Discord limite à 1024 caractères
      },
    ],
    timestamp: new Date().toISOString(),
  };

  const message = {
    embeds: [embed],
  };

  try {
    const response = await fetch(discordWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error("Erreur lors de l'envoi de la notification Discord");
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification Discord:", error);
  }
}

export async function action({ context, request }: ActionFunctionArgs) {
  const { env } = context.cloudflare;
  const discordWebhookUrl = env.DISCORD_CONTACT_FORM_WEBHOOK;
  const db = drizzle(env.DB);
  let body;
  const contentType = request.headers.get("content-type");

  if (contentType === null) {
    return new Response("No body to parse", { status: 400 });
  }

  if (contentType.includes("application/json")) {
    body = await request.json();
  }

  const parsedBody = contactFormSchema.parse(body);

  try {
    // Envoyer la notification Discord avant l'enregistrement en base
    await sendDiscordNotification(
      {
        email: parsedBody.email,
        message: parsedBody.message,
        location: parsedBody.location || "/",
      },
      discordWebhookUrl
    );

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
