import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { eq, InferSelectModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { radioTable } from "src/db/schema";
import Stripe from "stripe";

async function sendDiscordNotification(
  radio: InferSelectModel<typeof radioTable>,
  price: string,
  discordWebhookUrl: string
) {
  const embed = {
    title: "Nouvelle Vente!",
    color: 0x00ff00, // Vert
    fields: [
      {
        name: "Radio",
        value: `${radio.name || "Radio"} (#${radio.id})`,
        inline: true,
      },
      {
        name: "Prix",
        value: price,
        inline: true,
      },
      {
        name: "Date de vente",
        value: new Date().toLocaleString(),
        inline: true,
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
  const stripe = new Stripe(context.cloudflare.env.STRIPE_SECRET_KEY);
  const db = drizzle(env.DB);
  const secret = env.STRIPE_WEBHOOK_SIGNING_SECRET;
  const discordWebhookUrl = env.DISCORD_PAYMENT_WEBHOOK;
  if (!secret) {
    console.error("No secret");
    return new Response("No secret", {
      status: 400,
    });
  }
  const sig = request.headers.get("stripe-signature");
  let event;
  const payload = await request.text();

  if (!sig) {
    console.error("No stripe signature");
    return new Response("No stripe signature", {
      status: 400,
    });
  }

  try {
    event = await stripe.webhooks.constructEventAsync(payload, sig, secret);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Webhook Error:", err.message);
      return new Response("Webhook Error: " + err.message, {
        status: 400,
      });
    }
    console.error("Webhook Error");
    return new Response("Webhook Error", {
      status: 400,
    });
  }

  if (event.type == "checkout.session.completed") {
    const checkouSession = event.data.object;

    const lineItems = await stripe.checkout.sessions.listLineItems(
      checkouSession.id,
      {
        limit: 100,
        expand: ["data.price.product"],
      }
    );

    if (!lineItems) {
      console.error("No line items");
      return new Response("No line items", {
        status: 400,
      });
    }

    for (const item of lineItems.data) {
      if (!item.price) {
        console.error("Item price is null");
        throw new Error("Item price is null");
      }
      const product = item.price.product as Stripe.Product;
      if (!product.metadata.radioId) {
        console.error("No radioId in product metadata");
        throw new Error("No radioId in product metadata");
      }

      const radioItem = await db
        .select()
        .from(radioTable)
        .where(eq(radioTable.id, parseInt(product.metadata.radioId)));
      if (radioItem.length === 0) {
        console.error("Radio not found");
        throw new Error("Radio not found");
      }
      const radio = radioItem[0];
      if (radio.is_sold) {
        console.error("Radio already sold");
        throw new Error("Radio already sold");
      }

      // Format price
      const formattedPrice = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: item.currency || "EUR",
      }).format(item.amount_total ? item.amount_total / 100 : 0);

      // Envoyer la notification Discord
      await sendDiscordNotification(radio, formattedPrice, discordWebhookUrl);

      const result = await db
        .update(radioTable)
        .set({
          is_sold: true,
          sold_at: new Date().toISOString(),
        })
        .where(eq(radioTable.id, radio.id));
      if (!result.success) {
        console.error("Error updating radio");
        throw new Error("Error updating radio");
      }
    }
  }

  return new Response("Webhook received", {
    status: 200,
  });
}
