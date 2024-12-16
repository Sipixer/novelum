import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { radioTable } from "src/db/schema";
import Stripe from "stripe";
import { stripe } from "~/lib/stripe";

export default function NotFound() {
  return <div>Not found</div>;
}

export async function action({ context, request }: ActionFunctionArgs) {
  const { env } = context.cloudflare;
  const db = drizzle(env.DB);
  const secret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET; // process.env.WEBHOOK_SIGNING_SECRET
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
    // Fulfill the purchase...
    console.log("Fulfill the purchase", checkouSession);

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
      const result = await db
        .update(radioTable)
        .set({
          is_sold: true,
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
